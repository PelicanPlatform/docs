// Generates out/llm-full.txt (and out/llms.txt index) from the static export.
//
// Why work from `out/*.html` instead of the source MDX:
// the rendered HTML contains everything pulled in at build time (components,
// fetched data, generated tables) that the raw MDX text alone would miss.
//
// For each page we lift the rendered content body (`main[data-pagefind-body]`,
// the same body Pagefind indexes — i.e. content minus navbar/sidebar/footer/TOC),
// strip interactive chrome, convert it to Markdown, and concatenate everything
// in the order defined by the Nextra `_meta.js` files.

import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const OUT_DIR = path.resolve("out");
const APP_DIR = path.resolve("app");
const BASE_URL = (process.env.LLM_FULL_BASE_URL || "https://docs.pelicanplatform.org").replace(/\/$/, "");

// Pages that don't convert into useful Markdown get a hand-written stub instead.
const OVERRIDES = {
	"api-docs":
		"# API Documentation\n\n" +
		"Pelican's HTTP API is documented as an OpenAPI (Swagger) specification. " +
		"The rendered page is an interactive Swagger UI; the raw machine-readable spec is here:\n\n" +
		"https://raw.githubusercontent.com/PelicanPlatform/pelican/main/swagger/pelican-swagger.yaml\n",
};

// --- HTML -> Markdown -------------------------------------------------------

const turndown = new TurndownService({
	headingStyle: "atx",
	codeBlockStyle: "fenced",
	bulletListMarker: "-",
});
turndown.use(gfm);

// Drop fully interactive / non-content nodes that survive inside <article>.
turndown.remove(["script", "style", "button", "nav", "aside", "svg"]);

// Nextra wraps code in `<pre><div copy-toolbar/><code><span>…</span></code></pre>`.
// The toolbar means turndown's built-in rule (which requires <code> to be the
// first child) never fires, so the commands get dropped. Emit a fenced block
// straight from the <code> text content (the syntax-highlight spans collapse).
turndown.addRule("nextraFencedCode", {
	filter: (node) => node.nodeName === "PRE",
	replacement: (_content, node) => {
		const code = node.querySelector("code") || node;
		const text = code.textContent.replace(/\n+$/, "");
		return `\n\n\`\`\`\n${text}\n\`\`\`\n\n`;
	},
});

function slugToUrl(slug) {
	return slug === "index" ? `${BASE_URL}/` : `${BASE_URL}/${slug}`;
}

function htmlToMarkdown(html) {
	const root = parse(html, { comment: false });
	const body = root.querySelector("main[data-pagefind-body]") || root.querySelector("article");
	if (!body) return null;

	// Remove icon-only / permalink anchors (heading "#" links, copy buttons, etc.):
	// any <a> whose visible text is empty once trimmed.
	for (const a of body.querySelectorAll("a")) {
		if (!a.text || a.text.trim() === "") a.remove();
	}
	// NOTE: do NOT strip [data-pagefind-ignore] — Nextra tags code blocks with it
	// to keep them out of search, but code is exactly what we want for an LLM.

	const h1 = body.querySelector("h1");
	const title = h1 ? h1.text.trim() : null;

	const md = turndown.turndown(body.toString()).replace(/\n{3,}/g, "\n\n").trim();
	return { title, md };
}

// --- Page ordering from Nextra _meta.js -------------------------------------

// _meta.js files are ESM default-exporting an ordered object. The top-level one
// reads process.env.VERSIONS and throws if it's missing, so seed a default.
process.env.VERSIONS = process.env.VERSIONS || "['latest']";

async function loadMetaOrder(dir) {
	const metaPath = path.join(dir, "_meta.js");
	if (!fs.existsSync(metaPath)) return [];
	try {
		const mod = await import(pathToFileURL(metaPath).href + `?t=${Date.now()}`);
		return Object.keys(mod.default || {});
	} catch (err) {
		console.warn(`[llm-full] could not load ${metaPath}: ${err.message}`);
		return [];
	}
}

// Walk the meta tree, emitting page slugs (relative to out/) in document order.
async function collectSlugs(relDir = "", seen = new Set(), slugs = []) {
	const appDir = path.join(APP_DIR, relDir);
	const order = await loadMetaOrder(appDir);

	for (const key of order) {
		const slug = relDir ? `${relDir}/${key}` : key;
		// A page exists if out/<slug>.html exists.
		if (fs.existsSync(path.join(OUT_DIR, `${slug}.html`)) && !seen.has(slug)) {
			seen.add(slug);
			slugs.push(slug);
		}
		// A section exists if out/<slug>/ is a directory; recurse for its children.
		if (fs.existsSync(path.join(OUT_DIR, slug)) && fs.statSync(path.join(OUT_DIR, slug)).isDirectory()) {
			await collectSlugs(slug, seen, slugs);
		}
	}
	return slugs;
}

// Every shippable .html under out/, excluding framework/internal output.
function allPageSlugs() {
	const skipTop = new Set(["404", "index"]);
	const skipDirs = new Set(["_next", "_pagefind", "static"]);
	const results = [];
	const walk = (dir, rel) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				if (skipDirs.has(entry.name)) continue;
				walk(path.join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name);
			} else if (entry.name.endsWith(".html")) {
				const slug = (rel ? `${rel}/` : "") + entry.name.replace(/\.html$/, "");
				if (!rel && skipTop.has(entry.name.replace(/\.html$/, ""))) continue;
				results.push(slug);
			}
		}
	};
	walk(OUT_DIR, "");
	return results;
}

// --- Build ------------------------------------------------------------------

async function main() {
	if (!fs.existsSync(OUT_DIR)) {
		console.error("[llm-full] out/ not found — run `next build` first.");
		process.exit(1);
	}

	const ordered = await collectSlugs();
	const orderedSet = new Set(ordered);

	// Append any page the meta files missed, so nothing silently drops out.
	const extras = allPageSlugs().filter((s) => !orderedSet.has(s)).sort();
	if (extras.length) console.warn(`[llm-full] pages not in _meta, appended alphabetically: ${extras.join(", ")}`);
	const slugs = ["index", ...ordered, ...extras].filter((s, i, a) => a.indexOf(s) === i);

	const sections = [];
	const index = [];

	for (const slug of slugs) {
		let title;
		let md;

		if (OVERRIDES[slug]) {
			md = OVERRIDES[slug].trim();
			title = md.match(/^#\s+(.+)$/m)?.[1] ?? slug;
		} else {
			const file = path.join(OUT_DIR, `${slug}.html`);
			if (!fs.existsSync(file)) continue;
			const converted = htmlToMarkdown(fs.readFileSync(file, "utf8"));
			if (!converted || !converted.md) {
				console.warn(`[llm-full] no content body in ${slug}.html, skipping`);
				continue;
			}
			title = converted.title || slug;
			md = converted.md;
			// Ensure the section opens with an H1 carrying the title.
			if (!/^#\s/.test(md)) md = `# ${title}\n\n${md}`;
		}

		const url = slugToUrl(slug);
		sections.push(`Source: ${url}\n\n${md}`);
		index.push(`- [${title}](${url})`);
	}

	const header =
		`# Pelican Documentation — Full Text\n\n` +
		`> Concatenated, Markdown-converted content of the Pelican documentation site, ` +
		`generated from the built HTML for LLM consumption.\n` +
		`> Source: ${BASE_URL}\n`;

	const full = header + "\n" + sections.join("\n\n---\n\n") + "\n";
	fs.writeFileSync(path.join(OUT_DIR, "llm-full.txt"), full);

	const llmsTxt =
		`# Pelican Documentation\n\n` +
		`> Documentation for the Pelican Platform.\n\n` +
		`## Docs\n\n` +
		index.join("\n") + "\n";
	fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), llmsTxt);

	console.log(
		`[llm-full] wrote out/llm-full.txt (${sections.length} pages, ` +
			`${(full.length / 1024).toFixed(0)} KB) and out/llms.txt`,
	);
}

main().catch((err) => {
	console.error("[llm-full] failed:", err);
	process.exit(1);
});

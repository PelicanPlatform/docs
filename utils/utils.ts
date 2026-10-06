export function parseEnum<T>(value: any, enumObj: T): T[keyof T] | undefined {
  if (typeof value === 'string') {
    let foundKey = undefined
    Object.entries(enumObj).forEach((kv) => {
      const objVal = kv[1] as string
      if (objVal.toLowerCase() === value.toLowerCase()) {
        foundKey = kv[0] as T[keyof T]
        return
      }
    })
    return foundKey
  }
  return undefined;
}

/**
 * Get all the data from a paginated github api endpoint
 *
 * @param url
 */
export async function getAllGithub<T = any>(url: string): Promise<T[]> {

  let response: Response;
  let data: any[];

  const dataUrl = new URL(url)
  dataUrl.searchParams.set('per_page', '100')

  // Unauthenticated GitHub API calls are limited to 60 per hour per IP.
  // When the build runs in CI, pass GITHUB_TOKEN so paginated fetches do
  // not exhaust that budget; locally the variable is simply absent.
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  response = await fetch(dataUrl, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} (${dataUrl})`);
  }
  data = await response.json();

  while (response.headers.has('link')) {
    const link = response.headers.get("Link");
    const next = link.split(",").find((link: string) => link.includes('rel="next"'));
    if (!next) {
      break;
    }
    const nextUrl = next.match(/<(.*)>/)[1];
    response = await fetch(nextUrl, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} (${nextUrl})`);
    }
    data = data.concat(await response.json());
  }

  return data;
}

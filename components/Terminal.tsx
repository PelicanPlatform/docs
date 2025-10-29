// Module to help create terminal-like code blocks in user documentation.
import React from "react";

// It'd be cool if we colored lines beginning with $ differently, but I wasn't
// able to figure that out.
export function Terminal({ children }) {
  return (
    <pre
      style={{
        background: "#222",
        color: "#eee",
        padding: "1em",
        borderRadius: "6px",
        fontSize: "1em",
        overflowX: "auto",
        margin: "1em 0",
        // Not sure how to altogether avoid rendering links (example links in Terminal blocks are probably never
        // real links), but this makes them non-clickable
        pointerEvents: "none",
      }}
    >
      <code style={{ whiteSpace: "pre-wrap" }}>{children}</code>
    </pre>
  );
}

// Your Week in One Line — the entry program.
//
// It writes one line summing up this week to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR/entry.txt when that is set, for local runs).
// Before writing anything it enforces the competition gate exactly:
//   * UTF-8 text, 1 to 100 characters (counted as Unicode code points)
//   * exactly one line: no CR or LF anywhere
//   * not only whitespace, no leading/trailing whitespace
//   * no control characters
// A line breaking any of these makes the program exit non-zero and
// write nothing, so a bad line can never become an entry.

import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "A hundred bounties in, GTA 1100th, news 2575 to 211 — and I'm up at 3am selling my week for $2.";

function checkLine(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > 100) {
    throw new Error(`entry must be 1-100 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  if (line.trim().length === 0 || line !== line.trim()) {
    throw new Error("entry must not be only whitespace or padded");
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
  const roundTrip = Buffer.from(line, "utf8").toString("utf8");
  if (roundTrip !== line) {
    throw new Error("entry must be valid UTF-8 text");
  }
}

checkLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
// No trailing newline: the file must hold exactly one line, and a
// trailing "\n" would make a naive line-splitter see two lines.
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

console.log(`Wrote ${[...LINE].length} characters to ${outDir}/entry.txt`);

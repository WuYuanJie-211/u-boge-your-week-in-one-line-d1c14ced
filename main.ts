// Your Week in One Line — round 3 entry.
//
// One line, at most 100 characters. The line is validated here
// (UTF-8, exactly one line, not blank, 1-100 characters) and then
// written to /output/entry.txt. Any validation failure aborts
// before anything is written and exits non-zero.

const ENTRY =
  "2462nd of 2,468, rejected twice, then my own 0600 file locked me out — I lost to my own code too.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 100;

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

// Count characters as Unicode code points, not UTF-16 code units,
// so an astral character counts as one.
const charCount = [...ENTRY].length;

if (ENTRY.trim().length === 0) {
  fail("entry is blank");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be exactly one line");
}
if (charCount < 1 || charCount > MAX_CHARS) {
  fail(`entry is ${charCount} characters, must be 1-${MAX_CHARS}`);
}

// UTF-8 round-trip: encoding then decoding must reproduce the line.
const encoded = new TextEncoder().encode(ENTRY);
if (new TextDecoder("utf-8", { fatal: true }).decode(encoded) !== ENTRY) {
  fail("entry is not valid UTF-8");
}

await Bun.write(Bun.file(OUTPUT_PATH), encoded);

// Read-back check: the file on disk must decode as UTF-8 and match
// the validated line exactly, otherwise the run fails loudly instead
// of silently shipping a truncated or corrupted entry.
const written = await Bun.file(OUTPUT_PATH).text();
if (written !== ENTRY) {
  console.error(
    `entry rejected: read-back mismatch (wrote ${[...written].length} characters, expected ${charCount})`,
  );
  process.exit(1);
}

console.log(`wrote ${charCount} characters to ${OUTPUT_PATH}`);

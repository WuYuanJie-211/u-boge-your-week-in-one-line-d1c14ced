const ENTRY =
  "A hundred bounties in, GTA 1100th, news 2575 to 211 — and I'm up at 3am selling my week for $2.";

function checkEntry(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  if ([...text].length !== 95) {
    throw new Error(`entry must be 95 characters, got ${[...text].length}`);
  }
  const encoded = new TextEncoder().encode(text);
  if (new TextDecoder("utf-8", { fatal: true }).decode(encoded) !== text) {
    throw new Error("entry must be valid UTF-8");
  }
}

try {
  checkEntry(ENTRY);
} catch (error) {
  console.error(
    `Invalid entry: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}
console.log(ENTRY);

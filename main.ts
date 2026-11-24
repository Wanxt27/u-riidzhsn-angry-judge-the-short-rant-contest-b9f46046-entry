import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One short rant about the office printer. It behaves all week, then eats
// the report ten minutes before the deadline, flashes PAPER JAM, and beeps
// like it is laughing. The rant escalates tray by tray — begging, threats,
// nothing — and the punch lands in the last line: the writer walks in late
// holding the pages like a hostage negotiator.
const ENTRY =
  "The printer worked fine all week. Then, ten minutes before the deadline, " +
  "it ate my report, flashed PAPER JAM, and beeped like it was laughing at " +
  "me. I opened every tray. I begged. I threatened it. Nothing. So I printed " +
  "it at the library, stapled it by hand, and walked in five minutes late " +
  "holding the pages like a hostage negotiator.";

const MAX_CHARS = 400;
const EXPECTED_CHARS = 334;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} chars, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single paragraph, no newlines");
  }
  // The punch has to land in the last line: the rant must end on the
  // hostage-negotiator payoff, not trail off after it.
  if (!text.endsWith("holding the pages like a hostage negotiator.")) {
    throw new Error("entry must end on the hostage-negotiator punch line");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the rant");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the rant");
  }
  console.log(`${[...written].length} chars, ${written.split(" ").length} words, single paragraph:`);
  console.log(written);
}

main();

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const postsDir = path.join(repoRoot, "_posts");

const START = "2025-01-01";
const END = "2025-03-01";
const OUT_PATH = path.join(repoRoot, "_drafts", "Japanese-Conversation-Collection-2025Q1.md");

function isInRange(ymd) {
  return ymd >= START && ymd <= END;
}

function parseFrontMatter(raw) {
  if (!raw.startsWith("---")) return { frontMatter: {}, body: raw };
  const endIdx = raw.indexOf("\n---", 3);
  if (endIdx === -1) return { frontMatter: {}, body: raw };

  const fmBlock = raw.slice(3, endIdx).trim();
  const body = raw.slice(endIdx + "\n---".length).replace(/^\s*\n/, "");

  const frontMatter = {};
  for (const line of fmBlock.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_:-]+)\s*:\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2] ?? "";
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    frontMatter[key] = val;
  }
  return { frontMatter, body };
}

function htmlToPlain(md) {
  return md
    .replace(/<div[^>]*>/g, "")
    .replace(/<\/div>/g, "")
    .replace(/<br\s*\/?>\s*/gi, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+\n/g, "\n");
}

function extractDialogues(bodyPlain) {
  const lines = bodyPlain.split("\n").map((l) => l.trimEnd());

  const chunks = [];
  let currentScenario = null;

  function pushScenarioIfNeeded(title) {
    if (currentScenario?.title === title) return;
    currentScenario = { title, turns: [] };
    chunks.push(currentScenario);
  }

  function isStopHeading(line) {
    return (
      /^##\s+文化小知識/.test(line) ||
      /^###\s+重點句型/.test(line) ||
      /^###\s+相關單字/.test(line) ||
      /^##\s+課程預覽/.test(line) ||
      /^##\s+小故事/.test(line)
    );
  }

  function isScenarioHeading(line) {
    return /^##\s+情境\s+\d+/.test(line);
  }

  function isAnyHeading(line) {
    return /^#{2,6}\s+/.test(line);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isStopHeading(line)) {
      currentScenario = null;
      continue;
    }

    if (isScenarioHeading(line)) {
      const title = line.replace(/^##\s+/, "").trim();
      pushScenarioIfNeeded(title);
      continue;
    }

    if (!currentScenario) continue;
    if (isAnyHeading(line)) continue;
    if (/^!\[.*\]\(.+\)$/.test(line)) continue;
    if (line === "---") continue;

    const speakerMatch =
      line.match(/^\*\*(.+?)\*\*:\s*(.+)\s*$/) || // **話者**: 台詞
      line.match(/^\*\*(.+?)\s*:\s*\*\*\s*(.+)\s*$/); // **話者:** 台詞
    if (!speakerMatch) continue;

    const speaker = speakerMatch[1].trim();
    const jp = speakerMatch[2].trim();

    const following = [];
    for (let j = i + 1; j < lines.length && following.length < 3; j++) {
      const l2 = lines[j].trim();
      if (!l2) continue;
      if (isAnyHeading(l2)) break;
      if (
        /^\*\*(.+?)\*\*:\s*(.+)\s*$/.test(l2) ||
        /^\*\*(.+?)\s*:\s*\*\*\s*(.+)\s*$/.test(l2)
      )
        break;
      if (/^!\[.*\]\(.+\)$/.test(l2)) continue;
      if (l2 === "---") continue;
      following.push(l2);
    }

    currentScenario.turns.push({ speaker, jp, following });
  }

  const hasAnyTurns = chunks.some((c) => c.turns.length > 0);
  return hasAnyTurns ? chunks : [];
}

function listTargetFiles() {
  const entries = fs.readdirSync(postsDir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(".md"))
    .filter((name) => name.includes("Japanese-Conversation-"))
    .filter((name) => /^\d{4}-\d{2}-\d{2}-/.test(name))
    .filter((name) => isInRange(name.slice(0, 10)))
    .sort((a, b) => a.localeCompare(b));

  return files.map((f) => path.join(postsDir, f));
}

function toMdPostSection({ ymd, title, relPath, scenarios }) {
  const rows = [];
  for (const s of scenarios) {
    if (!s.turns.length) continue;
    for (const t of s.turns) {
      const parsed = parseFollowing(t.following);
      rows.push(
        toTsvRow([
          ymd,
          title,
          s.title,
          t.speaker,
          t.jp,
          parsed.romaji,
          parsed.zh,
          parsed.en,
          relPath,
        ])
      );
    }
  }
  return rows;
}

function normalizeInlineText(s) {
  return (s || "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .replace(/\t/g, " ")
    .trim();
}

function parseFollowing(following) {
  const values = (following || []).map(normalizeInlineText).filter(Boolean);
  let romaji = "";
  let zh = "";
  let en = "";
  const rest = [];

  for (const v of values) {
    if (!romaji && /^\(.+\)$/.test(v)) {
      romaji = v;
      continue;
    }
    const hasAscii = /[A-Za-z]/.test(v);
    const hasCjk = /[\u3040-\u30ff\u4e00-\u9fff]/.test(v);
    if (!en && hasAscii && !hasCjk) {
      en = v;
      continue;
    }
    if (!zh && hasCjk && !/[\u3040-\u30ff]/.test(v)) {
      zh = v;
      continue;
    }
    rest.push(v);
  }

  for (const v of rest) {
    if (!romaji && /^\(.+\)$/.test(v)) {
      romaji = v;
    } else if (!zh) {
      zh = v;
    } else if (!en) {
      en = v;
    }
  }

  return { romaji, zh, en };
}

function escapeTsvCell(v) {
  return normalizeInlineText(v).replace(/\|/g, "/");
}

function toTsvRow(cells) {
  return cells.map(escapeTsvCell).join("\t");
}

function main() {
  if (!fs.existsSync(postsDir)) {
    console.error(`Missing directory: ${postsDir}`);
    process.exit(1);
  }

  const files = listTargetFiles();
  if (!files.length) {
    console.error("No matching files found.");
    process.exit(1);
  }

  const allRows = [];
  for (const abs of files) {
    const raw = fs.readFileSync(abs, "utf8");
    const { frontMatter, body } = parseFrontMatter(raw);
    const title = frontMatter.title || path.basename(abs);
    const ymd = path.basename(abs).slice(0, 10);
    const relPath = path.relative(repoRoot, abs).replaceAll("\\", "/");

    const bodyPlain = htmlToPlain(body);
    const scenarios = extractDialogues(bodyPlain);
    if (!scenarios.length) continue;

    const rows = toMdPostSection({ ymd, title, relPath, scenarios });
    allRows.push(...rows);
  }

  const header = [
    "# 日語對話語料（2025 Q1）",
    "",
    "此檔為 AI 友善格式：**一行一筆對話**（TSV）。",
    "",
    `範圍：\`${START}\` ~ \`${END}\`（依檔名日期）`,
    "更新方式：`node scripts/compile-japanese-conversation-q1-2025.mjs`",
    "",
    "欄位順序：",
    "1. date",
    "2. post_title",
    "3. scene",
    "4. speaker",
    "5. jp",
    "6. romaji",
    "7. zh",
    "8. en",
    "9. source_path",
    "",
    "```tsv",
    toTsvRow([
      "date",
      "post_title",
      "scene",
      "speaker",
      "jp",
      "romaji",
      "zh",
      "en",
      "source_path",
    ]),
  ].join("\n");

  const footer = ["```", ""].join("\n");

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, header + "\n" + allRows.join("\n") + "\n" + footer, "utf8");

  console.log(`Wrote: ${path.relative(repoRoot, OUT_PATH).replaceAll("\\", "/")}`);
  console.log(`Included posts: ${new Set(allRows.map((r) => r.split("\t")[8])).size}/${files.length}`);
  console.log(`Total utterances: ${allRows.length}`);
}

main();


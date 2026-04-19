import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { buildAnswerCorpusRecords, createGeneratedCorpusArtifact } from "../lib/rag/build";
import { createQueryEmbedding } from "../lib/rag/openai";

const outputPath = path.resolve(process.cwd(), "lib/rag/generated/local-answer-corpus.generated.json");
const embeddingModel = "text-embedding-3-small";

function loadLocalEnvFile(filename: string) {
  const filepath = path.resolve(process.cwd(), filename);
  if (!existsSync(filepath)) return;

  const content = readFileSync(filepath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key]) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

async function main() {
  loadLocalEnvFile(".env.local");
  loadLocalEnvFile(".env");

  const records = buildAnswerCorpusRecords();
  const canEmbed = Boolean(process.env.OPENAI_API_KEY);

  if (canEmbed) {
    for (const [index, record] of records.entries()) {
      process.stdout.write(`Embedding ${index + 1}/${records.length}: ${record.id}\n`);
      record.embedding = await createQueryEmbedding(record.searchText);
    }
  } else {
    process.stdout.write("OPENAI_API_KEY not set. Writing the local corpus without embeddings.\n");
  }

  const artifact = createGeneratedCorpusArtifact(
    records,
    new Date().toISOString(),
    canEmbed ? embeddingModel : null,
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  process.stdout.write(`Wrote ${artifact.records.length} local answer records to ${outputPath}\n`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

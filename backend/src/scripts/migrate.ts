import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { queryClient } from "../db/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../../drizzle");

async function ensureMigrationsTable() {
  await queryClient`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

async function main() {
  await ensureMigrationsTable();

  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    const [existing] = await queryClient<{ filename: string }[]>`
      SELECT filename FROM schema_migrations WHERE filename = ${file}
    `;

    if (existing) {
      continue;
    }

    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    await queryClient.begin(async (tx) => {
      await tx.unsafe(sql);
      await tx`INSERT INTO schema_migrations (filename) VALUES (${file})`;
    });
    console.log(`Applied migration ${file}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await queryClient.end();
  });

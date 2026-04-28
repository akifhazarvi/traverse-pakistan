/**
 * Upload destination cover images to Cloudflare R2.
 * Usage: node scripts/upload-images.mjs <local-dir> <r2-type-prefix> [--force]
 *
 * Example:
 *   node scripts/upload-images.mjs "/path/to/cover photos" destinations
 *   → uploads hunza/featured-image.jpg → r2://traverse-media/destinations/hunza/cover.jpg
 *
 * Each subfolder is treated as a slug. The first supported image inside is
 * uploaded as cover.jpg regardless of the source filename.
 * Skips slugs where cover.jpg already exists on R2 (unless --force is passed).
 * Automatically purges Cloudflare CDN cache on overwrite.
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const {
  R2_BUCKET_NAME,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  CF_API_TOKEN,
  CF_ZONE_ID,
} = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
  console.error("Missing R2 credentials in .env.local");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const MIME_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

const SUPPORTED = new Set(Object.keys(MIME_MAP));

const CDN_BASE = "https://media.traversepakistan.com";

async function keyExists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function purgeCache(urls) {
  if (!CF_API_TOKEN || !CF_ZONE_ID) return;
  await fetch(`https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: urls }),
  });
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const [localDir, typePrefix] = args.filter((a) => !a.startsWith("--"));

  if (!localDir || !typePrefix) {
    console.error("Usage: node scripts/upload-images.mjs <local-dir> <r2-type-prefix> [--force]");
    console.error("  e.g. node scripts/upload-images.mjs \"/path/to/cover photos\" destinations");
    process.exit(1);
  }

  const slugDirs = await readdir(localDir, { withFileTypes: true });
  const slugs = slugDirs.filter((e) => e.isDirectory());

  console.log(`\nFound ${slugs.length} slug folders under: ${localDir}`);
  console.log(`Uploading to: ${typePrefix}/<slug>/cover.jpg${force ? " (--force: overwriting existing)" : ""}\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  let empty = 0;
  const purgeUrls = [];

  for (const slugEntry of slugs) {
    const slug = slugEntry.name;
    const slugPath = join(localDir, slug);
    const r2Key = `${typePrefix}/${slug}/cover.jpg`;

    const files = await readdir(slugPath, { withFileTypes: true });
    const imageFile = files.find(
      (f) => f.isFile() && SUPPORTED.has(extname(f.name).toLowerCase())
    );

    if (!imageFile) {
      console.log(`  EMPTY ${slug}`);
      empty++;
      continue;
    }

    const exists = await keyExists(r2Key);
    if (exists && !force) {
      console.log(`  SKIP  ${r2Key}`);
      skipped++;
      continue;
    }

    const localPath = join(slugPath, imageFile.name);
    const ext = extname(imageFile.name).toLowerCase();
    const mimeType = MIME_MAP[ext];

    try {
      const body = await readFile(localPath);
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: r2Key,
          Body: body,
          ContentType: mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      if (exists) {
        purgeUrls.push(`${CDN_BASE}/${r2Key}`);
        console.log(`  UPD   ${r2Key}`);
      } else {
        console.log(`  OK    ${r2Key}`);
      }
      uploaded++;
    } catch (err) {
      console.error(`  FAIL  ${r2Key} — ${err.message}`);
      failed++;
    }
  }

  if (purgeUrls.length > 0) {
    await purgeCache(purgeUrls);
    console.log(`\nPurged ${purgeUrls.length} CDN cache URL(s).`);
  }

  console.log(`\nDone. Uploaded: ${uploaded} | Skipped: ${skipped} | Empty: ${empty} | Failed: ${failed}`);
}

main();

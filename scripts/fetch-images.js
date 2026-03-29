#!/usr/bin/env node
/*
 * fetch-images.js
 *
 * Download images from Unsplash or Pexels based on keywords and
 * save them into an assets directory with a standardized name.
 *
 * Usage examples:
 *   node scripts/fetch-images.js --slug roteiro-disney-2026 --type carousel --query "disney castle,orlando sunset" --count 2
 *   node scripts/fetch-images.js --slug pascoa-disney --type blog --file keywords.txt --engine auto --out assets
 *
 * Env:
 *   UNSPLASH_ACCESS_KEY=...
 *   PEXELS_API_KEY=...
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = val;
    }
  }
  return args;
}

function readQueries(args) {
  if (args.file) {
    const content = fs.readFileSync(args.file, 'utf8');
    return content
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
  }
  if (args.query) {
    return args.query
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function httpsGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, res => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function httpsDownload(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          return resolve(httpsDownload(res.headers.location, destPath));
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode} on download`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', err => {
        fs.unlink(destPath, () => reject(err));
      });
  });
}

async function fetchUnsplash(query, accessKey) {
  if (accessKey) {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=1&orientation=portrait`;
    const data = await httpsGetJson(url, {
      Authorization: `Client-ID ${accessKey}`,
    });
    if (!data.results || !data.results.length) return null;
    const photo = data.results[0];
    return { url: photo.urls.raw + '&w=1200&q=80', id: photo.id, source: 'unsplash' };
  }
  // Fallback (no API key) - random image for the query
  const url = `https://source.unsplash.com/1200x1600/?${encodeURIComponent(query)}`;
  return { url, id: 'source', source: 'unsplash' };
}

async function fetchPexels(query, apiKey) {
  if (!apiKey) return null;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=portrait`;
  const data = await httpsGetJson(url, { Authorization: apiKey });
  if (!data.photos || !data.photos.length) return null;
  const photo = data.photos[0];
  return { url: photo.src.large2x || photo.src.large, id: photo.id, source: 'pexels' };
}

async function fetchImage(query, engine, keys) {
  if (engine === 'unsplash') return fetchUnsplash(query, keys.unsplash);
  if (engine === 'pexels') return fetchPexels(query, keys.pexels);
  // auto
  return (await fetchUnsplash(query, keys.unsplash)) || (await fetchPexels(query, keys.pexels));
}

function safeName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  const args = parseArgs(process.argv);
  const slug = args.slug;
  const type = args.type || 'post';
  const engine = args.engine || 'auto';
  const outDir = args.out || 'assets';
  const count = parseInt(args.count || '1', 10);

  if (!slug) {
    console.error('Missing --slug');
    process.exit(1);
  }

  const queries = readQueries(args);
  if (!queries.length) {
    console.error('Provide --query "a,b" or --file keywords.txt');
    process.exit(1);
  }

  const keys = {
    unsplash: process.env.UNSPLASH_ACCESS_KEY,
    pexels: process.env.PEXELS_API_KEY,
  };

  ensureDir(outDir);

  let downloaded = 0;
  let index = 1;

  for (const q of queries) {
    for (let i = 0; i < count; i++) {
      const result = await fetchImage(q, engine, keys);
      if (!result) {
        console.warn(`No image found for: ${q}`);
        continue;
      }
      const suffix = safeName(q).slice(0, 40) || 'image';
      const fileName = `USADO_${slug}__${type}__${String(index).padStart(2, '0')}__${result.source}-${suffix}.jpg`;
      const dest = path.join(outDir, fileName);
      await httpsDownload(result.url, dest);
      console.log(`Downloaded: ${dest}`);
      downloaded++;
      index++;
    }
  }

  console.log(`\nDone. ${downloaded} file(s) saved to ${outDir}.`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

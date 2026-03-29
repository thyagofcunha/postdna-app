#!/usr/bin/env node
/**
 * publish-to-supabase.js — Magic Dani Blog SEO Squad
 *
 * Publica um artigo JSON no Supabase.
 *
 * Uso:
 *   node scripts/publish-to-supabase.js <caminho-do-artigo.json>
 *
 * Ex.:
 *   node scripts/publish-to-supabase.js output/melhor-epoca-disney/artigo.json
 *
 * O artigo.json deve ter os campos da tabela posts.
 * Campos obrigatórios: title, slug, content
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const https = require('https');

const SUPABASE_URL    = process.env.SUPABASE_URL;
const SERVICE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BLOG_DOMAIN     = process.env.BLOG_DOMAIN || 'blog.magicdani.com.br';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Credenciais não encontradas. Verifique o arquivo .env');
  process.exit(1);
}

const articlePath = process.argv[2];
if (!articlePath) {
  console.error('❌  Uso: node scripts/publish-to-supabase.js <artigo.json>');
  process.exit(1);
}

const fs   = require('fs');
const path = require('path');

const absPath = path.isAbsolute(articlePath)
  ? articlePath
  : path.resolve(process.cwd(), articlePath);

if (!fs.existsSync(absPath)) {
  console.error(`❌  Arquivo não encontrado: ${absPath}`);
  process.exit(1);
}

const article = JSON.parse(fs.readFileSync(absPath, 'utf8'));

// Campos obrigatórios
if (!article.title || !article.slug || !article.content) {
  console.error('❌  O artigo.json precisa ter pelo menos: title, slug, content');
  process.exit(1);
}

// Defaults
const payload = {
  title:                article.title,
  slug:                 article.slug,
  summary:              article.summary              || null,
  content:              article.content,
  cover_image_url:      article.cover_image_url      || null,
  keywords:             article.keywords             || null,
  meta_title:           article.meta_title           || article.title,
  meta_description:     article.meta_description     || article.summary || null,
  published:            article.published            ?? false,
  published_at:         article.published_at         || null,
  scheduled_at:         article.scheduled_at         || null,
  reading_time_minutes: article.reading_time_minutes || null,
  category:             article.category             || null,
};

// ─── Chamada à API REST do Supabase ─────────────────────────────────────────
const body = JSON.stringify(payload);
const url  = new URL(`${SUPABASE_URL}/rest/v1/posts`);

const options = {
  hostname: url.hostname,
  path:     url.pathname + '?on_conflict=slug',
  method:   'POST',
  headers: {
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(body),
    'apikey':         SERVICE_KEY,
    'Authorization':  `Bearer ${SERVICE_KEY}`,
    'Prefer':         'resolution=merge-duplicates,return=representation',
  },
};

console.log(`\n🚀  Magic Dani — Publicando artigo no Supabase`);
console.log(`📄  Slug: ${payload.slug}`);
console.log(`🏷️   Status: ${payload.published ? 'PUBLICADO' : 'RASCUNHO'}\n`);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201) {
      const result = JSON.parse(data);
      const post = Array.isArray(result) ? result[0] : result;
      console.log(`✅  Artigo salvo com sucesso!`);
      console.log(`    ID:     ${post.id}`);
      console.log(`    Slug:   ${post.slug}`);
      console.log(`    Status: ${post.published ? 'Publicado' : 'Rascunho'}`);
      if (post.published) {
        console.log(`    URL:    https://${BLOG_DOMAIN}/${post.slug}`);
      }
    } else {
      console.error(`❌  Erro ${res.statusCode}:`, data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌  Erro na requisição:', err.message);
  process.exit(1);
});

req.write(body);
req.end();

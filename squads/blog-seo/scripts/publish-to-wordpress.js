#!/usr/bin/env node
/**
 * publish-to-wordpress.js — Adaptador Global PostDNA
 *
 * Exemplo de script para publicar o artigo.json gerado pelos agentes
 * diretamente em um blog WordPress via REST API.
 * 
 * Configurações no .env esperadas:
 * WP_API_URL=https://seudominio.com/wp-json/wp/v2
 * WP_USER=seu_usuario
 * WP_APP_PASSWORD=sua_senha_de_aplicativo_wp
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const https = require('https');

const WP_URL = process.env.WP_API_URL;
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_APP_PASSWORD;

if (!WP_URL || !WP_USER || !WP_PASS) {
  console.error('❌  Credenciais WordPress ausentes no .env. Configure WP_API_URL, WP_USER e WP_APP_PASSWORD.');
  process.exit(1);
}

const articlePath = process.argv[2];
if (!articlePath) {
  console.error('❌  Uso: node scripts/publish-to-wordpress.js <artigo.json>');
  process.exit(1);
}

const absPath = path.isAbsolute(articlePath) ? articlePath : path.resolve(process.cwd(), articlePath);
if (!fs.existsSync(absPath)) {
  console.error(`❌  Arquivo não encontrado: ${absPath}`);
  process.exit(1);
}

// O Agente entrega o artigo neste formato universal:
const article = JSON.parse(fs.readFileSync(absPath, 'utf8'));

// O WordPress espera conteúdo em HTML nativamente. Se você usar Markdown puro na API, 
// existem plugins no WP. Mas assumindo HTML basic:
// Transformar o markdown content num HTML simples ou assumir plugin Markdown no WP.
const payload = {
  title: article.title,
  slug: article.slug,
  content: article.content, // Se precisar, integre a lib 'marked' aqui para converter const html = marked.parse(article.content)
  excerpt: article.summary,
  status: 'draft', // Sempre publica como rascunho
  // wp meta tags/SEO costumam ir via plugins como Yoast/RankMath usando chaves meta:
  // meta: { _yoast_wpseo_title: article.meta_title, _yoast_wpseo_metadesc: article.meta_description }
};

const body = JSON.stringify(payload);
const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
const url = new URL(`${WP_URL}/posts`);

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Authorization': `Basic ${auth}`
  }
};

console.log(`\n🚀 PostDNA — Enviando artigo para o WordPress: ${url.hostname}`);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const wpPost = JSON.parse(data);
      console.log(`✅  Sucesso! Post criado como Rascunho no WP.`);
      console.log(`    Link para edição: ${wpPost.link}&action=edit`);
    } else {
      console.error(`❌  Erro do WP (Status ${res.statusCode}):`, data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌  Falha na conexão:', err.message);
  process.exit(1);
});

req.write(body);
req.end();

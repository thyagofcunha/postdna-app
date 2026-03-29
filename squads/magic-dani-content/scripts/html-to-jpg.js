#!/usr/bin/env node
/**
 * html-to-jpg.js — Magic Dani Content Squad v2.0
 *
 * Converte todos os HTMLs de slides e stories em JPGs de alta qualidade,
 * usando o protocolo file:// (sem servidor local).
 *
 * Uso:   node scripts/html-to-jpg.js <caminho-da-pasta-output>
 * Ex.:   node scripts/html-to-jpg.js output/25-03-2026-melhor-epoca-disney
 *
 * Regras:
 *   - slide-*.html  → 1080×1440px
 *   - story-*.html  → 1080×1920px
 *   - Aguarda 800ms após networkidle para carregar fontes remotas
 *   - Deleta os HTMLs após conversão bem-sucedida
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ─── Argumentos ──────────────────────────────────────────────────────────────
const outputArg = process.argv[2];
if (!outputArg) {
  console.error('❌  Uso: node scripts/html-to-jpg.js <caminho-da-pasta-output>');
  console.error('    Ex.: node scripts/html-to-jpg.js output/25-03-2026-melhor-epoca-disney');
  process.exit(1);
}

// Resolve relativo à raiz do projeto (dois níveis acima de scripts/)
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const absOutputDir = path.isAbsolute(outputArg)
  ? outputArg
  : path.resolve(projectRoot, outputArg);

if (!fs.existsSync(absOutputDir)) {
  console.error(`❌  Pasta não encontrada: ${absOutputDir}`);
  process.exit(1);
}

// ─── Listar HTMLs ────────────────────────────────────────────────────────────
const htmlFiles = fs.readdirSync(absOutputDir)
  .filter(f => f.endsWith('.html') && (f.startsWith('slide-') || f.startsWith('story-')))
  .sort();

if (htmlFiles.length === 0) {
  console.log('⚠️  Nenhum arquivo HTML de slide ou story encontrado em:', absOutputDir);
  process.exit(0);
}

console.log(`\n🎨  Magic Dani — Conversão HTML → JPG`);
console.log(`📁  Pasta: ${absOutputDir}`);
console.log(`📄  Arquivos: ${htmlFiles.length} HTMLs encontrados\n`);

// ─── Conversão ───────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch();
  let converted = 0;
  let errors = 0;

  for (const htmlFile of htmlFiles) {
    const isStory = htmlFile.startsWith('story-');
    const width  = 1080;
    const height = isStory ? 1920 : 1440;
    const basename = path.basename(htmlFile, '.html');
    const htmlPath = path.join(absOutputDir, htmlFile);
    const jpgPath  = path.join(absOutputDir, `${basename}.jpg`);

    try {
      const page = await browser.newPage();
      await page.setViewportSize({ width, height });
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800); // aguarda fontes Google Fonts carregarem

      await page.screenshot({
        path: jpgPath,
        fullPage: false,
        type: 'jpeg',
        quality: 95,
      });

      console.log(`  ✓  ${basename}.jpg  (${width}×${height})`);
      converted++;
      await page.close();

      // Deleta o HTML após conversão bem-sucedida
      fs.unlinkSync(htmlPath);

    } catch (err) {
      console.error(`  ✗  Erro ao converter ${htmlFile}:`, err.message);
      errors++;
    }
  }

  await browser.close();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅  ${converted} imagem(ns) gerada(s) com sucesso`);
  if (errors > 0) {
    console.log(`⚠️   ${errors} erro(s) — verifique os arquivos acima`);
  }
  console.log(`📂  Salvas em: ${absOutputDir}\n`);

  process.exit(errors > 0 ? 1 : 0);
})();

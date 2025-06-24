import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownIt from 'markdown-it';

const md = new markdownIt({ html: true });

const outputDir = path.resolve('frontend/public/nojs');
fs.mkdirSync(outputDir, { recursive: true });

const pagesDir = path.resolve('content/pages');
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
const contacts = [];
const pages = files.map(file => {
  const filePath = path.join(pagesDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = data.slug || path.parse(file).name;
  const title = data.title || slug;
  if (slug === 'contact') {
    contacts.concat(data.contacts);
  }
  return { slug, title, data, content }
});

const siteTitle = 'Josh Dickie';
const siteCopyright = `&copy; ${new Date().getFullYear()} Joshua Dickie.`;
const siteAttributions = `Icons by <a href="https://iconoir.com" target="_blank" rel="noopener noreferrer">Iconoir</a>`

function renderHeader(navLinks: string, contactLinks: string) {
  return `
<header>
  <h1>${siteTitle}</h1>
  <nav>${navLinks}</nav>
  <div class="contact-icons">${contactLinks}</div>
</header>
`;
}

function renderFooter() {
  return `
<footer>
  <p>${siteCopyright} ${siteAttributions}</p>
</footer>
`;
}

function htmlTemplate(pageTitle: string, bodyContent: string, navLinks: string, iconLinks: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle} — ${siteTitle}</title>
  <link rel="stylesheet" href="/nojs/style.css" />
</head>
<body>
  ${renderHeader(navLinks, iconLinks)}
  <main>
    <div class="page-title">${pageTitle}</div>
    <div class="page-content">
      ${bodyContent}
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function buildNavLinks() {
  return pages
    .map(
      p =>
        `<a href="/nojs/${p.slug}.html">${p.title}</a>`
    )
    .join(' | ');
}

function buildIconLinks(contactData: any[] | undefined) {
  if (!contactData) return '';

  return contactData
    .map(item => {
      const label = item.label || '';
      const url = item.url || '#';
      const iconPath = `/icons/${item.icon}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${iconPath}" alt="${label} link icon" class="icon" /></a>`;
    })
    .join(' ');
}

function buildBody(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  //TODO: switch statement matching known page types with specific page templates, with default fallthrough template for plain paragraph body
  return '';
}

async function buildPage(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  const navLinks = buildNavLinks();
  const iconLinks = buildIconLinks(contacts);
  const htmlBody = buildBody(page);
  const html = htmlTemplate(page.title, htmlBody, navLinks, iconLinks);

  const outputPath = path.join(outputDir, `${page.slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`✅ Generated: ${outputPath}`);
}

async function main() {
  for (const page of pages) {
    await buildPage(page);
  }

  console.log('✅ No-JS pages generated.');
}

main().catch(err => {
  console.error('❌ Failed to generate no-JS pages:', err);
  process.exit(1);
});

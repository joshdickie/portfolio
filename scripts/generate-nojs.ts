import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownIt from 'markdown-it';

const md = new markdownIt({ html: true });

const outputDir = path.resolve('frontend/public/nojs');
fs.mkdirSync(outputDir, { recursive: true });

const pagesDir = path.resolve('content/pages');
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
const contacts: {type: string; label: string; url: string; icon: string}[] = [];
const pages = files.map(file => {
  const filePath = path.join(pagesDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = data.slug || path.parse(file).name;
  const title = data.title || slug;
  if (slug === 'contact') {
    contacts.push(...data.contacts);
  }
  return { slug, title, data, content }
});

const siteTitle = 'Josh Dickie';
const siteCopyright = `&copy; ${new Date().getFullYear()} Joshua Dickie.`;
const siteAttributions = `Icons by <a href="https://iconoir.com" target="_blank" rel="noopener noreferrer">Iconoir</a> and Emma Tusuzian`

function buildNavLinks() {
  return pages.map((page) =>
    `<a href="/nojs/${page.slug}.html">${page.title}</a>`
  ).join(' | ');
}

function buildIconLinks(contactData: {type: string; label: string; url: string; icon: string}[]) {
  return contactData.map((item) => {
      const label = item.label || '';
      const url = item.url || '#';
      const iconPath = `/icons/${item.icon}`;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${iconPath}" alt="${label} link icon" class="icon" /></a>`;
    })
    .join(' ');
}

function renderHeader(navLinks: string, contactLinks: string) {
  return `
    <header>
      <h1><img src="/monogram.png" alt="Josh Dickie monogram" class="imgage/png" />${siteTitle}</h1>
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
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
      <link rel="manifest" href="/site.webmanifest">
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
    </html>
  `;
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

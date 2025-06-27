import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import markdownIt from 'markdown-it';

const md = new markdownIt({ html: true });

const outputDir = path.resolve('frontend/public/nojs');
fs.mkdirSync(outputDir, { recursive: true });

const pagesDir = path.resolve('content/pages');
const pageFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));
const pages = pageFiles.map(file => {
  const filePath = path.join(pagesDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = data.slug || path.parse(file).name;
  const title = data.title || slug;
  return { slug, title, data, content }
});

const projectsDir = path.resolve('content/projects');
const projectFiles = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));
const projects = projectFiles.map(file => {
  const filePath = path.join(projectsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = data.slug || path.parse(file).name;
  const title = data.title || slug;
  const thumbnail = data.thumbnail || 'default-project-thumbnail.png';
  const summary = data.summary || '';
  const tags = data.tags || [];
  const featured = data.featured || false;
  return {
    slug,
    title,
    thumbnail,
    summary,
    tags,
    featured,
    content
  };
});

const contactsPath = path.join(path.resolve('content'), 'contact.md');
const { data: contactsData, content: _ } = matter(fs.readFileSync(contactsPath, 'utf8'));
const contacts: {type: string; label: string; url: string; icon: string}[] = contactsData.contacts;

const siteTitle = 'Josh Dickie';
const siteCopyright = `&copy; ${new Date().getFullYear()} Joshua Dickie.`;
const siteAttributions = `Icons by <a href="https://iconoir.com" target="_blank" rel="noopener noreferrer">Iconoir</a>, <a href="https://simpleicons.org/" target="_blank" rel="noopener noreferrer">Simple Icons</a>, and Emma Tusuzian`

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
      <div class="header-left">
        <img id="monogram" src="/monogram.png" alt="Josh Dickie monogram" class="image/png" />
        <h1>${siteTitle}</h1>
      </div>
      <div class="header-right">
        <nav>${navLinks}</nav>
        <div class="contact-icons">${contactLinks}</div>
      </div>
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
      <link rel="stylesheet" href="/nojs/styles.css" />
    </head>
    <body>
      <div class="page-container">
        ${renderHeader(navLinks, iconLinks)}
        <main>
          <div class="page-title">${pageTitle}</div>
          <div class="page-content">
            ${bodyContent}
          </div>
        </main>
        ${renderFooter()}
      </div>
    </body>
    </html>
  `;
}

function buildAboutBody(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  const noJsContent  = page.content.replace(
    'a reflection of how I like to build: flexible, practical, and with just enough fun baked in. Hope you find something here that you like!',
    'and it looks like you\'ve found the no-JS view. Take a look around and enjoy this simplified version of the site - JavaScript is optional here!'
  );
  const renderedContent = md.render(noJsContent);
  return `
    <div id="about-wrapper">
      <div id="about-head">
        <img src="/img/josh.png" alt="Josh Dickie headshot" />
        <div id="about-summary">
          ${renderedContent}
        </div>
      </div>
    </div>
  `;
}

function buildProjectsBody(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  const { featuredProjects, otherProjects } = projects.reduce((acc, project) => {
    if (project.featured) {
      acc.featuredProjects.push(project);
    } else {
      acc.otherProjects.push(project);
    }
    return acc;
  },{
    featuredProjects: [] as typeof projects,
    otherProjects: [] as typeof projects
  });

  const featuredProjectsGrid = `
    <div class="projects-grid">
      ${featuredProjects.map((project) => `
          <a href="/nojs/projects/${project.slug}.html" class="project-card" style="background-image: url('/img/${project.thumbnail}')">
            <div class="project-card-overlay">
              <h3>${project.title}</h3>
              <p>${project.summary}</p>
            </div>
          </a>
        `
      ).join('/n')}
    </div>
  `;

  const otherProjectsList = otherProjects.length ? `
    <div class="other-projects">
      <h2>Other Projects</h2>
      <ul>
        ${otherProjects.map(project => `
            <li>
              <a href="/nojs/projects/${project.slug}.html"><strong>${project.title}</strong></a>
            </li>
          `
        ).join('/n')}
      </ul>
    </div>
  ` : '';

  const renderedContent = md.render(page.content);
  return `
    <div id="projects-wrapper">
      <div id="projects-head">
        <div id="projects-summary">
          ${renderedContent}
        </div>
        ${featuredProjectsGrid}
        ${otherProjectsList}
      </div>
    </div>
  `;

  return '';
}

function buildGenericBody(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  const renderedContent = md.render(page.content);
  return `<div>${renderedContent}</div>`;
}

function buildPageBody(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  //TODO: switch statement matching known page types with specific page templates, with default fallthrough template for plain paragraph body
  switch (page.slug) {
    case 'index':
      return buildAboutBody(page);
    case 'projects':
      return buildProjectsBody(page);
    default:
      return buildGenericBody(page);
  }
}

async function buildPage(page: { slug: string; title: string; data: { [key: string]: any; }; content: string }) {
  const navLinks = buildNavLinks();
  const iconLinks = buildIconLinks(contacts);
  const htmlBody = buildPageBody(page);
  const html = htmlTemplate(page.title, htmlBody, navLinks, iconLinks);

  const outputPath = path.join(outputDir, `${page.slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`✅ Generated: ${outputPath}`);
}

function buildProjectPageBody(project: { slug: string; title: string; thumbnail: string; summary: string; tags: [string]; featured: boolean; content: string }) {
  const renderedContent = md.render(project.content)
  return `<div>${renderedContent}</div>`;

}

async function buildProjectPage(project: { slug: string; title: string; thumbnail: string; summary: string; tags: [string]; featured: boolean; content: string }) {
  const navLinks = buildNavLinks();
  const iconLinks = buildIconLinks(contacts);
  const htmlBody = buildProjectPageBody(project);
  const html = htmlTemplate(project.title, htmlBody, navLinks, iconLinks);

  const outputPath = path.join(outputDir, `projects/${project.slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`✅ Generated: ${outputPath}`);
}

async function main() {
  for (const page of pages) {
    await buildPage(page);
  }
  for (const project of projects) {
    await buildProjectPage(project);
  }

  console.log('✅ No-JS pages generated.');
}

main().catch(err => {
  console.error('❌ Failed to generate no-JS pages:', err);
  process.exit(1);
});

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'portfolio';

async function seedPages(db) {
  const pagesDir = path.resolve('content/pages');
  const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.md'));

  const pagesCollection = db.collection('pages');

  for (const file of files) {
    const filePath = path.join(pagesDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const { title, slug, date, ...rest } = data;

    await pagesCollection.updateOne(
      { slug },
      {
        $set: {
          title,
          slug,
          date: new Date(date),
          content,
          iterables: rest
        }
      },
      { upsert: true }
    );

    console.log(`✅ Seeded page: ${file}`);
  }
}

async function seedProjects(db) {
  const projectsDir = path.resolve('content/projects');
  const files = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));

  const projectsCollection = db.collection('projects');

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);

    await projectsCollection.updateOne(
      { slug: data.slug },
      {
        $set: {
          title: data.title,
          slug: data.slug,
          date: new Date(data.date),
          summary: data.summary || '',
          tags: data.tags || [],
          featured: data.featured || false,
          content
        }
      },
      { upsert: true }
    );

    console.log(`✅ Seeded project: ${file}`);
  }
}

async function main() {
  console.log(`Connecting to ${MONGO_URI}...`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(MONGO_DB_NAME);
  console.log('✅ Mongo connected — ready to seed.');

  console.log('Seeding pages...');
  await seedPages(db);

  console.log('Seeding projects...');
  await seedProjects(db);

  console.log('✅ Database seed complete.');
  await client.close();
}

main().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

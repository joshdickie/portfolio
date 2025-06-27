import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'portfolio';

async function copyResources(db) {
  const srcDir = path.resolve('content/resources');
  const backedDestDir = path.resolve('backend/public/resources');
  const frontendDestDir = path.resolve('frontend/public/resources');
  fs.mkdirSync(backedDestDir, { recursive: true });
  fs.mkdirSync(frontendDestDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  const resourcesCollection = db.collection('resources');

  console.log(`Copying resources from ${srcDir} to ${backedDestDir} and ${frontendDestDir}...`);

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const backedDestPath = path.join(backedDestDir, file);
    const frontedDestPath = path.join(frontendDestDir, file);

    // Copy files
    fse.copySync(srcPath, backedDestPath);
    fse.copySync(srcPath, frontedDestPath);

    const slug = path.parse(file).name;
    const type = path.extname(file).slice(1).toLowerCase();
    const stats = fs.statSync(srcPath);
    const size = stats.size;

    await resourcesCollection.updateOne(
      { slug },
      {
        $set: {
          title: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          type,
          path: `/resources/${file}`,
          size,
        },
      },
      { upsert: true }
    );

    console.log(`✅ Copied: ${file} (${size} bytes)`);
  }

  console.log('✅ Resource copy complete.');
}

async function main() {
  console.log(`Connecting to ${MONGO_URI}...`);
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(MONGO_DB_NAME);
  console.log('✅ Mongo connected — ready to copy resources.');

  await copyResources(db);

  await client.close();
}

main().catch((err) => {
  console.error('❌ Copy resources failed:', err);
  process.exit(1);
});

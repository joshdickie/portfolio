#!/bin/bash
set -e

echo "Seeding pages and projects..."
npx tsx scripts/seed-db.ts

echo "Copying resources..."
npx tsx scripts/copy-resources.ts

echo "Database initialization complete."

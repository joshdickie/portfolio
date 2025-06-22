#!/bin/bash
set -e

echo "Formatting frontend..."
npx --prefix frontend prettier --write .

echo "Formatting backend..."
npx --prefix backend prettier --write .

echo "Format complete"

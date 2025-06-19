#!/bin/bash
set -e

echo "Linting frontend..."
npm --prefix frontend run lint

echo "Linting backend..."
npm --prefix backend run lint

echo "Lint complete"

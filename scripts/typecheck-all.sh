#!/bin/bash
set -e

echo "Typechecking frontend..."
npm --prefix frontend run typecheck

echo "Typechecking backend..."
npm --prefix backend run typecheck

echo "Typecheck complete"

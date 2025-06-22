#!/bin/bash

echo "Linting frontend..."
npm --prefix frontend run lint

echo "Linting backend..."
npm --prefix backend run lint

echo "Linting complete"
#!/bin/bash

echo "👷‍♂️ Forcing npm install with --force"
npm install --force

echo "🔨 Building project"
npm run build

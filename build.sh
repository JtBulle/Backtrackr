#!/bin/bash

# Build the Svelte components
npm run build

# Copy the HTML file to the correct location
cp dist/src/popup/popup.html dist/popup.html

# Fix the asset paths to be relative
sed -i 's|src="/popup.js"|src="popup.js"|g' dist/popup.html
sed -i 's|href="/popup.css"|href="popup.css"|g' dist/popup.html

# Copy background and content scripts
cp src/background.js dist/background.js
cp src/content-script.js dist/content-script.js

# Copy manifest and icons
cp manifest.json dist/manifest.json
cp -r icons dist/icons

# Clean up the nested directory
rm -rf dist/src

echo "Build complete!"
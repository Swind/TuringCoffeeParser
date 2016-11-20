#!/bin/sh
echo "Rebuild 'libs' in the node_modules"
rm -rf node_modules/libs
npm install

echo "Clean folder"
rm -rf build

echo "Build backend.js"
webpack

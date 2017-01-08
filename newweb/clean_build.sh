#!/bin/sh
echo "Rebuild 'libs' in the node_modules"
rm -rf node_modules/libs
rm yarn.lock
npm install

echo "Clean folder"
rm -rf static

echo "Build backend.js"
webpack

#!/bin/sh
echo "Rebuild 'libs' in the node_modules"
rm -rf node_modules/turing-coffee-process
rm -rf yarn.lock
yarn install

echo "Clean folder"
rm -rf build

echo "Build backend.js"
webpack

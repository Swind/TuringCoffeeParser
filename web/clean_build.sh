#!/bin/sh
echo "Rebuild 'libs' in the node_modules"
rm -rf node_modules/libs
rm yarn.lock
yarn install

echo "Clean folder"
rm -rf static 

echo "Build backend.js"
webpack

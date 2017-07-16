#!/bin/sh
echo "Rebuild 'turing-coffee-libs' in the node_modules"
rm -rf node_modules/turing-coffee-libs
rm -rf yarn.lock
yarn install
yarn build

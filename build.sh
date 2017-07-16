#!/bin/sh
echo "Install libraries for libs"
cd libs
yarn install
cd ..

echo "Build server..."
cd server
./clean_build.sh
cd ..

echo "Build web..."
cd redesign_web
yarn install
yarn build
cd ..

echo "Copy all files to dist..."
rm -rf dist
mkdir -p dist/public
cp server/build/* dist
cp redesign_web/production/* dist/public

echo "Tar the dist folder"
tar -zcvf turing_coffee.tar.gz dist

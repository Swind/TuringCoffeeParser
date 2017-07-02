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
cd web
./clean_build.sh
cd ..

echo "Build new web..."
cd newweb
./clean_build.sh
cd ..

echo "Copy all files to dist..."
rm -rf dist
mkdir -p dist/public/new/
cp server/build/* dist
cp web/static/* dist/public
cp newweb/static/* dist/public/new/

echo "Tar the dist folder"
tar -zcvf turing_coffee.tar.gz dist

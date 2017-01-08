#!/bin/sh
echo "Install libraries for libs"
cd libs
npm install
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
mkdir -p dist/public
cp server/build/* dist
cp web/static/* dist/public

echo "Tar the dist folder"
tar -zcvf turing_coffee.tar.gz dist

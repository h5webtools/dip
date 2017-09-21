#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
appDir="/data1/fe_www/easymock/easy-mock"

# copy project files
cp -vr "$workdir/build" "$appDir/build"
cp -vr "$workdir/config" "$appDir/config"
cp -vr "$workdir/controllers" "$appDir/controllers"
cp -vr "$workdir/middlewares" "$appDir/middlewares"
cp -vr "$workdir/models" "$appDir/models"
cp -vr "$workdir/proxy" "$appDir/proxy"
cp -vr "$workdir/public" "$appDir/public"
cp -vr "$workdir/util" "$appDir/util"
cp -vr "$workdir/views" "$appDir/views"

cp -v "$workdir/.babelrc" "$appDir/.babelrc"
cp -v "$workdir/.eslintrc.js" "$appDir/.eslintrc.js"
cp -v "$workdir/.postcssrc.js" "$appDir/.postcssrc.js"
cp -v "$workdir/app.js" "$appDir/app.js"
cp -v "$workdir/CHANGELOG.md" "$appDir/CHANGELOG.md"
cp -v "$workdir/package.json" "$appDir/package.json"
cp -v "$workdir/router-config.js" "$appDir/router-config.js"

# release
echo "entering $appDir"
cd $appDir
cd ..

echo "docker-compose up"
/usr/local/bin/docker-compose up

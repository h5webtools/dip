#!/bin/sh

export DOCKER_HOST=tcp://172.16.1.10:4243

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
appDir="/data1/fe_www/easymock/easy-mock"

# copy project files
cp -vr "$workdir/build" $appDir
cp -vr "$workdir/config" $appDir
cp -vr "$workdir/controllers" $appDir
cp -vr "$workdir/middlewares" $appDir
cp -vr "$workdir/models" $appDir
cp -vr "$workdir/proxy" $appDir
cp -vr "$workdir/public" $appDir
cp -vr "$workdir/util" $appDir
cp -vr "$workdir/views" $appDir

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
/usr/local/bin/docker-compose up -d

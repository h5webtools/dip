#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
releasedir="$workdir/release"
appDir="/data1/fe_www/easymock/easy-mock"

# clear release dir
echo "clear $releasedir"
if [ -d "$releasedir" ]; then
    rm -rf "$releasedir"
fi

# create release dir
echo "create $releasedir"
mkdir "$releasedir"

# copy project files
cp -vr "$workdir/build" "$releasedir/build"
cp -vr "$workdir/config" "$releasedir/config"
cp -vr "$workdir/controllers" "$releasedir/controllers"
cp -vr "$workdir/middlewares" "$releasedir/middlewares"
cp -vr "$workdir/models" "$releasedir/models"
cp -vr "$workdir/proxy" "$releasedir/proxy"
cp -vr "$workdir/public" "$releasedir/public"
cp -vr "$workdir/util" "$releasedir/util"
cp -vr "$workdir/views" "$releasedir/views"

cp -v "$workdir/.babelrc" "$releasedir/.babelrc"
cp -v "$workdir/.eslintrc.js" "$releasedir/.eslintrc.js"
cp -v "$workdir/.postcssrc.js" "$releasedir/.postcssrc.js"
cp -v "$workdir/app.js" "$releasedir/app.js"
cp -v "$workdir/CHANGELOG.md" "$releasedir/CHANGELOG.md"
cp -v "$workdir/package.json" "$releasedir/package.json"
cp -v "$workdir/router-config.js" "$releasedir/router-config.js"

# release
echo "entering $releasedir & scp"
cd $releasedir

cp -vr "$releaseDir/*" $appDir

cd $appDir
cd ..

echo "docker-compose up"
docker-compose up -d

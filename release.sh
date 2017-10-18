#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
releasedir="$workdir/release"

# clear release dir
echo "clear $releasedir"
if [ -d "$releasedir" ]; then
    rm -rf "$releasedir"
fi

# create release dir
echo "create $releasedir"
mkdir "$releasedir"

mkdir "$releasedir/client"
mkdir "$releasedir/server"

# copy project files
cp -vr "$workdir/client/dist" "$releasedir/client/dist"
cp -vr "$workdir/server/app" "$releasedir/server/app"
cp -vr "$workdir/server/config" "$releasedir/server/config"
cp -vr "$workdir/server/constants" "$releasedir/server/constants"

cp -v "$workdir/server/package.json" "$releasedir/server/package.json"
cp -v "$workdir/server/index.js" "$releasedir/server/index.js"
cp -v "$workdir/server/app.js" "$releasedir/server/app.js"

cp -v "$workdir/makefile" "$releasedir/makefile"

# release
echo "entering $releasedir & scp"
cd $releasedir

scp -P 36000 -r ./ root@172.16.1.10:/data1/fe_www/dip

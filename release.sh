#!/bin/sh

# variables
basedir=`dirname "$0"`
workdir=`dirname "$basedir"`
releasedir="/data1/fe_www/easymock/easy-mock"

# build
echo "build static"
cnpm i
cnpm run build

echo "copy project files"
cp -vr $workdir $releasedir

echo "entering $releasedir & docker-compose up"
cd $releasedir

docker-compose up -d

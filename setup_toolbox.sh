#!/bin/sh
# This script installs nodejs and runs instalation of dependancies for handy toolbax,
# primarily 'lineman' and 'linema-ember' packages.
# For more info read the 'Readme.md'.

apt-get update
apt-get install nodejs
cd web
npm install
cd ../

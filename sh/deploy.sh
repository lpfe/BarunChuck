#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node

cd BarunChuck

git pull;

SRC=/work/BarunChuck/nodejs/hello
DEST=/$HOME/deploy

rm -rf $DEST
mkdir -p $DEST
cp -rf $SRC $DEST

cd $DEST/hello

source ~/.bashrc

npm install

pm2 restart all
#!/usr/bin/env bash

cd ../../vocably-reverse-translations && npm run download-prod
cd -
cd ../sync-server
./sync.mts de
./build-seo-search-data.mts
cd -
cd ../
git add .
git commit -m "feat(www-seo): regenerate seo pages"
git push

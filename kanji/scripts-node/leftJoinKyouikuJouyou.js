#!/usr/bin/env node

'use strict';

const fs = require('fs');

const kyouikuFileName = '../json/kyouiku.json';
const jouyouFileName = '../json/jouyou.json';
const kyouiku = JSON.parse(
  fs.readFileSync(kyouikuFileName).toString()
);
const jouyou = JSON.parse(
  fs.readFileSync(jouyouFileName).toString()
);

kyouiku.forEach((kyouikuItem) => {
  let jouyouItem = jouyou.find((item) => item.kanji === kyouikuItem.kanji);
  kyouikuItem.kanjiOld = jouyouItem.kanjiOld;
  kyouikuItem.radical = jouyouItem.radical;
  kyouikuItem.readings = jouyouItem.readings;
});

const fileNameOut = "../json/kyouikuPlus.json";
fs.writeFileSync(fileNameOut, JSON.stringify(kyouiku, null, 2));

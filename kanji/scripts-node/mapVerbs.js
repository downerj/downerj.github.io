#!/usr/bin/env node

'use strict';

const fs = require('fs');

const fileNameIn = '../json/JapaneseWords.json';
const masterList = JSON.parse(
  fs.readFileSync(fileNameIn).toString()
);
const masterListVerbs = masterList[0];

const verbListOut = {};
masterListVerbs.forEach((item) => {
  let kanjiRuby = item.wordJSON.kanji;
  let type = item.wordJSON.type;
  let english = item.wordJSON.eng;
  let conjugations = item.conjugation.conjugations;
  let tense = item.conjugation.tense.toLowerCase();
  let affirmative = item.conjugation.affirmative;
  let polite = item.conjugation.polite;
  
  let kana = kanjiRuby
    .replace(/(<\/?ruby>)|(<\/?rt)/g, '')
    .replace(/[^\u3040-\u309F]/g, '');
  let kanji = kanjiRuby
    .replace(/<\/?ruby>/g, '')
    .replace(/<rt>[\u3040-\u309F]*<\/rt>/g, '');
  
  if (!(kanji in verbListOut)) {
    verbListOut[kanji] = {
      type: type,
      html: kanjiRuby,
      english: english,
      conjugations: {
        present: {
          affirmative: {
            polite: {
              kana: null,
              kanji: null,
            },
            casual: {
              kana: kana,
              kanji: kanji,
            },
          },
          negative: {
            polite: {
              kana: null,
              kanji: null,
            },
            casual: {
              kana: null,
              kanji: null,
            },
          },
        },
        past: {
          affirmative: {
            polite: {
              kana: null,
              kanji: null,
            },
            casual: {
              kana: null,
              kanji: null,
            },
          },
          negative: {
            polite: {
              kana: null,
              kanji: null,
            },
            casual: {
              kana: null,
              kanji: null,
            },
          },
        },
        te: {
          kana: null,
          kanji: null,
        },
      },
    };
  }
  
  let verbObject = verbListOut[kanji];
  let conjugationList = null;
  
  let tenseObject = (tense === "present") ?
    verbObject.conjugations.present :
    (tense === "past") ?
    verbObject.conjugations.past :
    verbObject.conjugations.te;
  if (tense === "present" || tense === "past") {
    let affirmativeObject = (affirmative) ?
      tenseObject.affirmative :
      tenseObject.negative;
    let politeObject = (polite) ?
      affirmativeObject.polite :
      affirmativeObject.casual;
    conjugationList = politeObject;
  } else /* tense === "te" */ {
    conjugationList = tenseObject;
  }
  
  conjugationList.kana = conjugations[0];
  conjugationList.kanji = conjugations[1];
});

const fileNameOut = "../json/JapaneseVerbs.json";
fs.writeFileSync(fileNameOut, JSON.stringify(verbListOut, null, 2));

// console.log(Object.keys(verbListOut));
// console.log(JSON.stringify(verbListOut, null, 2));

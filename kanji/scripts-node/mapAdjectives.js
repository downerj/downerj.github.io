#!/usr/bin/env node

'use strict';

const fs = require('fs');

const fileNameIn = '../json/JapaneseWords.json';
const masterList = JSON.parse(
  fs.readFileSync(fileNameIn).toString()
);
const masterListAdjectives = masterList[1];

const adjectiveListOut = {};
masterListAdjectives.forEach((item) => {
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
  
  if (!(kanji in adjectiveListOut)) {
    adjectiveListOut[kanji] = {
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
          // Present-negative will be filled in later.
          negative: {
            polite: {},
            casual: {},
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
          // Past-negative will be filled in later.
          negative: {
            polite: {},
            casual: {},
          },
        },
        adverb: {
          kana: null,
          kanji: null,
        },
      },
    };

    let conjugationsObject = adjectiveListOut[kanji].conjugations;
    let presentObject = conjugationsObject.present;
    let pastObject = conjugationsObject.past;

    if (type !== "na") /* type === "ira" || type === "i" */ {
      presentObject.negative.polite = {
        naidesu: {
          kana: null,
          kanji: null,
        },
        arimasen: {
          kana: null,
          kanji: null,
        },
      };
      presentObject.negative.casual = {
        kana: null,
        kanji: null,
      };

      pastObject.negative.polite = {
        nakattadesu: {
          kana: null,
          kanji: null,
        },
        arimasendeshita: {
          kana: null,
          kanji: null,
        },
      };
      pastObject.negative.casual = {
        kana: null,
        kanji: null,
      };
    } else /* type === "na" */ {
      presentObject.negative.polite = {
        janaidesu: {
          kana: null,
          kanji: null,
        },
        dewanaidesu: {
          kana: null,
          kanji: null,
        },
        jaarimasen: {
          kana: null,
          kanji: null,
        },
        dewaarimasen: {
          kana: null,
          kanji: null,
        },
      };
      presentObject.negative.casual = {
        janai: {
          kana: null,
          kanji: null,
        },
        dewanai: {
          kana: null,
          kanji: null,
        },
      };

      pastObject.negative.polite = {
        janakattadesu: {
          kana: null,
          kanji: null,
        },
        dewanakattadesu: {
          kana: null,
          kanji: null,
        },
        jaarimasendeshita: {
          kana: null,
          kanji: null,
        },
        dewaarimasendeshita: {
          kana: null,
          kanji: null,
        },
      };
      pastObject.negative.casual = {
        janakatta: {
          kana: null,
          kanji: null,
        },
        dewanakatta: {
          kana: null,
          kanji: null,
        },
      };
    }
  }
  
  let adjectiveObject = adjectiveListOut[kanji].conjugations;
  let conjugationList = null;
  let tenseObject = (tense === "present") ?
    adjectiveObject.present :
    (tense === "past") ?
    adjectiveObject.past :
    adjectiveObject.adverb;
  if (tense === "present" || tense === "past") {
    let affirmativeObject = (affirmative) ?
      tenseObject.affirmative :
      tenseObject.negative;
    let politeObject = (polite) ?
      affirmativeObject.polite :
      affirmativeObject.casual;
    conjugationList = politeObject;
  } else /* tense === "adverb" */ {
    conjugationList = tenseObject;
  }
  
  if (tense === "present") {
    if (type !== "na") /* type === "ira" || type === "i" */ {
      if (!polite || affirmative) {
        conjugationList.kana = conjugations[0];
        conjugationList.kanji = conjugations[1];
      } else /* polite && !affirmative */ {
        conjugationList.naidesu.kana = conjugations[0];
        conjugationList.arimasen.kana = conjugations[1];
        conjugationList.naidesu.kanji = conjugations[2];
        conjugationList.arimasen.kanji = conjugations[3];
      }
    } else /* type === "na" */ {
      if (affirmative) {
        conjugationList.kana = conjugations[0];
        conjugationList.kanji = conjugations[1];
      } else /* !affirmative */ {
        if (polite) {
          conjugationList.janaidesu.kana = conjugations[0];
          conjugationList.dewanaidesu.kana = conjugations[1];
          conjugationList.jaarimasen.kana = conjugations[2];
          conjugationList.dewaarimasen.kana = conjugations[3];
          conjugationList.janaidesu.kanji = conjugations[4];
          conjugationList.dewanaidesu.kanji = conjugations[5];
          conjugationList.jaarimasen.kanji = conjugations[6];
          conjugationList.dewaarimasen.kanji = conjugations[7];
        } else /* !polite */ {
          conjugationList.janai.kana = conjugations[0];
          conjugationList.dewanai.kana = conjugations[1];
          conjugationList.janai.kanji = conjugations[2];
          conjugationList.dewanai.kanji = conjugations[3];
        }
      }
    }
  } else if (tense === "past") {
    if (type !== "na") /* type === "ira" || type === "i" */ {
      if (!polite || affirmative) {
        conjugationList.kana = conjugations[0];
        conjugationList.kanji = conjugations[1];
      } else /* polite && !affirmative */ {
        conjugationList.nakattadesu.kana = conjugations[0];
        conjugationList.arimasendeshita.kana = conjugations[1];
        conjugationList.nakattadesu.kanji = conjugations[2];
        conjugationList.arimasendeshita.kanji = conjugations[3];
      }
    } else /* type === "na" */ {
      if (affirmative) {
        conjugationList.kana = conjugations[0];
        conjugationList.kanji = conjugations[1];
      } else /* !affirmative */ {
        if (polite) {
          conjugationList.janakattadesu.kana = conjugations[0];
          conjugationList.dewanakattadesu.kana = conjugations[1];
          conjugationList.jaarimasendeshita.kana = conjugations[2];
          conjugationList.dewaarimasendeshita.kana = conjugations[3];
          conjugationList.janakattadesu.kanji = conjugations[4];
          conjugationList.dewanakattadesu.kanji = conjugations[5];
          conjugationList.jaarimasendeshita.kanji = conjugations[6];
          conjugationList.dewaarimasendeshita.kanji = conjugations[7];
        } else /* !polite */ {
          conjugationList.janakatta.kana = conjugations[0];
          conjugationList.dewanakatta.kana = conjugations[1];
          conjugationList.janakatta.kanji = conjugations[2];
          conjugationList.dewanakatta.kanji = conjugations[3];
        }
      }
    }
  } else /* tense === "adverb" */ {
    conjugationList.kana = conjugations[0];
    conjugationList.kanji = conjugations[1];
  }
});

const fileNameOut = "../json/JapaneseAdjectives.json";
fs.writeFileSync(fileNameOut, JSON.stringify(adjectiveListOut, null, 2));

// console.log(Object.keys(verbListOut));
// console.log(JSON.stringify(verbListOut, null, 2));

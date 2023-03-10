var jouyou = (() => {
  function sanitizeCellText(text) {
    return text.replaceAll(/\[[a-zA-Z0-9]+\]/g, '');
  }

  function unpackIfSingle(array) {
    return (array.length === 1)
      ? array[0]
      : array;
  }

  function getCellTextOrArray(text) {
    return unpackIfSingle(
      sanitizeCellText(text)
        .split(/[;,\u3001]/)
        .map(text => text.trim())
    );
  }
  
  let result = [];

  let table = document.getElementsByClassName('wikitable')[0];
  [...table.rows].slice(1).forEach((row) => {
    let index = parseInt(row.cells[0].innerText.trim());
    let kanji = sanitizeCellText(row.cells[1].innerText.trim());
    let kanjiOld = sanitizeCellText(row.cells[2].innerText.trim()) || null;
    let radical = row.cells[3].innerText.trim();
    let strokes = parseInt(row.cells[4].innerText.trim());
    let grade = row.cells[5].innerText.trim();
    if (grade !== 'S') {
      grade = parseInt(grade);
    }
    let yearAdded = row.cells[6].innerText.trim() || null;
    let meaning = getCellTextOrArray(row.cells[7].innerText);
    let readings = row.cells[8].innerText.split('\n').map(text => getCellTextOrArray(text));

    result.push({
      index: index,
      kanji: kanji,
      kanjiOld: kanjiOld,
      radical: radical,
      strokes: strokes,
      grade: grade,
      yearAdded: yearAdded,
      meaning: meaning,
      readings: {
        kana: readings[0],
        romaji: readings[1],
      },
    });
  });

  return result;
})();

var jouyouJSON = JSON.stringify(jouyou, null, 2);

(() => {
  let jsonTextArea = document.createElement('TEXTAREA');
  document.body.appendChild(jsonTextArea);
  jsonTextArea.value = jouyouJSON;
})();

var kyouiku = (() => {
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

  let tables = [...document.getElementsByClassName('wikitable')].slice(0, 7);
  tables.forEach((table, table_index) => {
    [...table.rows].slice(1).forEach((row) => {
      let index = parseInt(row.cells[0].innerText);
      let kanji = row.cells[1].innerText;
      let grade = (table_index < 6)
        ? table_index + 1
        : 'S';
      let strokes = parseInt(row.cells[2].innerText);
      let meaning = getCellTextOrArray(row.cells[3].innerText);
      let onyomi = getCellTextOrArray(row.cells[4].innerText) || null;
      let kunyomi = getCellTextOrArray(row.cells[5].innerText) || null;

      result.push({
        index: index,
        kanji: kanji,
        grade: grade,
        strokes: strokes,
        meaning: meaning,
        onyomi: onyomi,
        kunyomi: kunyomi,
      });
    });
  });

  return result;
})();

var kyouikuJSON = JSON.stringify(kyouiku, null, 2);

(() => {
  let jsonTextArea = document.createElement('TEXTAREA');
  document.body.appendChild(jsonTextArea);
  jsonTextArea.value = kyouikuJSON;
})();

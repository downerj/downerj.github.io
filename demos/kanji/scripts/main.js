function ajaxGetAsync(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.addEventListener('readystatechange', (_) => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    });
    xhr.send();
  });
}

let container;
let kanjiFocus;
let kanjiOldFocus;
let newLabel;
let radicalLabel;
let englishLabel;
let gradeLabel;
let strokesLabel;
let unicodeLabel;

function focusOnKanji(kanjiItem) {
  kanjiFocus.innerText = kanjiItem.kanji;
  if (kanjiItem.kanjiOld !== null) {
    kanjiOldFocus.innerText = kanjiItem.kanjiOld;
    kanjiFocus.classList.add('clickable');
    newLabel.classList.remove('hidden');
  } else {
    kanjiOldFocus.innerText = '';
    kanjiFocus.classList.remove('clickable');
    newLabel.classList.add('hidden');
  }
  radicalLabel.innerText = kanjiItem.radical;
  englishLabel.innerText = (Array.isArray(kanjiItem.meaning))
    ? kanjiItem.meaning.join(', ')
    : kanjiItem.meaning;
  gradeLabel.innerText = kanjiItem.grade;
  strokesLabel.innerText = kanjiItem.strokes;
  unicodeLabel.innerText = kanjiItem.kanji.charCodeAt(0).toString(16);
}

function revealKanjiFocus() {
  kanjiOldFocus.classList.add('hidden');
  kanjiFocus.classList.remove('hidden');
  newLabel.innerHTML = '&orarr;';
}

function revealKanjiOldFocus() {
  kanjiFocus.classList.add('hidden');
  kanjiOldFocus.classList.remove('hidden');
  newLabel.innerHTML = '&olarr;';
}

window.addEventListener('load', async (_) => {
  container = document.getElementById('container');
  kanjiFocus = document.getElementById('kanjiFocus');
  kanjiOldFocus = document.getElementById('kanjiOldFocus');
  newLabel = document.getElementById('newLabel');
  radicalLabel = document.getElementById('radicalLabel');
  englishLabel = document.getElementById('englishLabel');
  gradeLabel = document.getElementById('gradeLabel');
  strokesLabel = document.getElementById('strokesLabel');
  unicodeLabel = document.getElementById('unicodeLabel');

  container.addEventListener('selectstart', (event) => {
    event.preventDefault();
    return false;
  });
  container.addEventListener('selectstart', (event) => {
    event.preventDefault();
    return false;
  });

  let selectedIndex = -1;
  let kanjiElements = [];

  let kanjiTable = document.getElementById('kanjiTable');
  kyouikuPlus.forEach((item, index) => {
    let kanjiElement = document.createElement('DIV');
    kanjiElement.classList.add('kanji-element');
    if (item.kanjiOld !== null) {
      
    }
    switch (item.grade) {
      case 1:
        kanjiElement.classList.add('kanji-grade-1');
        break;
      case 2:
        kanjiElement.classList.add('kanji-grade-2');
        break;
      case 3:
        kanjiElement.classList.add('kanji-grade-3');
        break;
      case 4:
        kanjiElement.classList.add('kanji-grade-4');
        break;
      case 5:
        kanjiElement.classList.add('kanji-grade-5');
        break;
      case 6:
        kanjiElement.classList.add('kanji-grade-6');
        break;
      case 'S':
        kanjiElement.classList.add('kanji-grade-S');
        break;
    }
    kanjiElement.classList.add('clickable');
    kanjiElement.innerText = item.kanji;
    
    kanjiElement.addEventListener('mouseover', (_) => {
      if (selectedIndex === -1) {
        focusOnKanji(item);
      }
    });

    kanjiElement.addEventListener('click', (_) => {
      if (selectedIndex !== -1) {
        kanjiElements[selectedIndex].classList.remove('kanji-selected');
      }

      if (selectedIndex !== index) {
        selectedIndex = index;
        kanjiElement.classList.add('kanji-selected');
      } else {
        selectedIndex = -1;
        kanjiElement.classList.remove('kanji-selected');
      }
      focusOnKanji(item);
      revealKanjiFocus();
    });

    kanjiTable.appendChild(kanjiElement);
    kanjiElements.push(kanjiElement);
  });

  kanjiFocus.addEventListener('click', (_) => {
    if (selectedIndex === -1 || kyouikuPlus[selectedIndex].kanjiOld === null) {
      return;
    }
    
    revealKanjiOldFocus();
  });

  kanjiOldFocus.addEventListener('click', (_) => {
    revealKanjiFocus();
  });
});

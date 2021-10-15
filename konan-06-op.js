
function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('1');
    }, ms);
  })
}

const clavierList = [];
for(const level of  document.getElementById('piano').childNodes[5].shadowRoot.getElementById('container').getElementsByTagName('piano-keyboard-octave')) {
  const aList = [];
  const bList = [];
  
  for(const clavier of  level.shadowRoot.getElementById('white-notes').getElementsByTagName('piano-keyboard-note')) {
    const c = clavier.shadowRoot.getElementById('container').getElementsByTagName('button')[0];
    aList.push(c);
  }

  for(const clavier of  level.shadowRoot.getElementById('black-notes').getElementsByTagName('piano-keyboard-note')) {
    const c = clavier.shadowRoot.getElementById('container').getElementsByTagName('button')[0];
    bList.push(c);
  }
  bList.shift();

  clavierList.push({
    'low': aList,
    'high': bList,
  });
}

/*
  도 = 1
  레 = 2
  미 = 3
  파 = 4
  솔 = 5
  라 = 6
  시 = 7
*/

async function send(level, idx, isHigh=false, _delay=100) {
  const blackWhite = isHigh ? 'high' : 'low';

  clavierList[level][blackWhite][idx-1].dispatchEvent(new Event('mousedown'));
  await delay(_delay);
  clavierList[level][blackWhite][idx-1].dispatchEvent(new Event('mouseup'));
}

const unit = 1200;
let count = 0;

async function left() {
  await delay(unit / 4);

  await send(2, 3, false, unit / 4);
  await send(2, 7, false, unit / 4);
  await send(3, 3, false, unit / 4);
  await send(2, 7, false, unit / 4);

  await send(2, 3, false, unit / 4);
  await send(2, 7, false, unit / 4);
  await send(3, 3, false, unit / 4);
  await send(2, 7, false, unit / 4);

  await send(2, 1, false, unit / 4);
  await send(2, 5, false, unit / 4);
  await send(3, 1, false, unit / 4);
  await send(2, 5, false, unit / 4);

  await send(2, 1, false, unit / 4);
  await send(2, 5, false, unit / 4);
  await send(3, 1, false, unit / 4);
  await send(2, 5, false, unit / 4);

  await send(2, 2, false, unit / 4);
  await send(2, 6, false, unit / 4);
  await send(3, 2, false, unit / 4);
  await send(2, 6, false, unit / 4);

  await send(2, 2, false, unit / 4);
  await send(2, 6, false, unit / 4);
  await send(3, 2, false, unit / 4);
  await send(2, 6, false, unit / 4);

  await send(2, 5, false, unit / 4);
  await send(3, 2, false, unit / 4);
  await send(3, 5, false, unit / 4);
  await send(3, 2, false, unit / 4);

  await send(1, 7, false, unit / 4);
  await send(2, 4, true, unit / 4);
  await send(2, 7, false, unit / 4);
  await send(2, 4, true, unit / 4);

  if (count === 1) {
    await send(2, 3, false, unit / 4);
    await send(2, 7, false, unit / 4);
    await send(3, 3, false, unit / 4);
    await send(2, 7, false, unit / 4);

    await send(2, 3, false, unit);
  }
}

async function right() {
  await send(4, 5, false, unit / 8);
  await send(4, 6, false, unit / 8);

  await send(4, 7, false, unit / 4 + unit / 8);
  await send(4, 6, false, unit / 4 + unit / 8);
  await send(4, 5, false, unit / 2);

  await send(4, 4, true, unit / 4);
  await send(4, 3, false, unit / 4);
  await send(4, 4, true, unit / 4);

  await send(4, 5, false, unit / 4);
  await send(4, 6, false, unit / 4);
  await send(4, 5, false, unit / 4);
  await send(4, 4, true, unit / 4);

  await send(4, 4, true, unit / 4);
  await send(4, 3, false, unit / 8);
  await send(4, 3, false, unit / 2);
  await send(4, 3, false, unit / 8);

  await send(4, 2, false, unit / 4);
  await send(4, 3, false, unit / 4);
  await send(4, 4, true, unit / 4);
  await send(4, 5, false, unit / 4);

  await send(4, 4, true, unit / 4 + unit / 8);
  await send(4, 3, false, unit / 8);
  await send(4, 3, false, unit / 4);
  await send(4, 2, false, unit / 4);

  if (count === 0) {
    await send(4, 5, false, unit / 4);
    await send(4, 6, false, unit / 4);
    await send(4, 7, false, unit / 4);
    await send(5, 1, false, unit / 4);

    await send(4, 7, false, unit / 2 + unit / 4);
  }
  else {
    await send(4, 7, false, unit / 4 + unit / 8);
    await send(4, 6, false, unit / 4 + unit / 8);
    await send(4, 5, false, unit / 4);

    await send(4, 4, true, unit / 2);
    await send(4, 4, true, unit / 4);
    await send(4, 3, false, unit / 8);

    await send(4, 3, false, unit * 2);
  }
}

async function main() {
  for (let i = 0; i < 2; i++) {
    left();
    await right();
    count++;
  }
}

main();

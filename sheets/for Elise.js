function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('1');
    }, ms);
  })
}

// 건반의 element 를 긁어오는 부분
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


// 모든 옥타브의 건반을 치는 함수
async function sendAll(idx, isHigh=false, _delay=100) {
   const blackWhite = isHigh ? 'high' : 'low';

  for(const level of clavierList) {
    level[blackWhite][idx-1].dispatchEvent(new Event('mousedown'));
  }
  await delay(_delay);
  for(const level of clavierList) {
    level[blackWhite][idx-1].dispatchEvent(new Event('mouseup'));
  }
}

const base = 4;

// 해당 옥타브의 건반을 치는 함수
// 도=1 레=2 ...
async function send(level, nodeString, _delay=100) {
  const blackWhite = nodeString.endsWith('#') ? 'high' : 'low';
  nodeString = nodeString.replace('#', '');
  const bb = ['도', '레', '미', '파', '솔', '라', '시'];
  
  let bb1 = bb.indexOf(nodeString);

  clavierList[base+level][blackWhite][bb1].dispatchEvent(new Event('mousedown'));
  await delay(_delay);
  clavierList[base+level][blackWhite][bb1].dispatchEvent(new Event('mouseup'));
}




async function main() {

  
  await send(+1, '미', 300);
  await send(+1, '레#', 300);
  await send(+1, '미', 300);
  await send(+1, '레#', 300);
  await send(+1, '미', 300);
  await send(0, '시', 300);
  await send(+1, '레', 300);
  await send(+1, '도', 300);

  send(-1, '라', 2000);
  await send(0, '라', 500);
  await delay(10);
  await send(0, '도', 300);
  await send(0, '미', 300);
  await send(0, '라', 300);

  send(-1, '미', 2000);
  await send(0, '시', 500);
  await delay(10);
  await send(0, '미', 490);
  await send(0, '솔#', 500);
  await send(0, '시', 500);

  send(-1, '라', 2000);
  await send(+1, '도', 500);
  await delay(10);
  await send(0, '미', 490);
  await send(+1, '미', 300);
  await send(+1, '레#', 300);

  await send(+1, '미', 300);
  await send(+1, '레#', 300);
  await send(+1, '미', 300);
  await send(+1, '레#', 300);

  await send(+1, '미', 300);
  await send(0, '시', 300);
  await send(+1, '레', 300);
  await send(+1, '도', 300);

  send(-1, '라', 2000);
  await send(0, '라', 500);
  await send(0, '도', 300);
  await send(0, '미', 300);
  await send(0, '라', 300);

  send(-1, '미', 2000);
  await send(0, '시', 500);
  await send(0, '미', 490);
  await send(+1, '도', 500);
  await send(0, '시', 500);

  send(-1, '라', 500);
  await send(+1, '라', 500);
  await send(+1, '미', 300);
  await send(+1, '레#', 300);

  // 0:24
  await send(+1, '미', 300);
  await send(+1, '레#', 300);
  await send(+1, '미', 300);
  await send(0, '시', 300);
  await send(+1, '레', 300);
  await send(+1, '도', 300);

  send(-1, '라', 2000);
  await send(0, '라', 500);
  await send(0, '도', 500);
  await send(0, '미', 500);
  await send(0, '라', 500);

  send(-1, '미', 2000);
  await send(0, '시', 500);
  await send(0, '미', 500);
  await send(0, '솔#', 500);
  await send(0, '시', 500);

  send(-1, '라', 2000);
  await send(+1, '도', 500);
  await send(0, '미', 500);
  await send(+1, '미', 500);
  await send(+1, '레#', 500);

  await send(+1, '미', 300);
  await send(+1, '레#', 300);
  await send(+1, '미', 300);
  await send(0, '시', 300);
  await send(+1, '레', 300);
  await send(+1, '도', 300);

  // 0:32
  send(-1, '라', 2000);
  await send(0, '라', 500);
  await send(0, '도', 500);
  await send(0, '미', 500);
  await send(0, '라', 500);

  
  send(-1, '미', 2000);
  await send(0, '시', 500);
  await send(0, '미', 500);
  await send(1, '도', 500);
  await send(0, '시', 500);

  send(-1, '라', 700);
  await send(0, '라', 500);
  await send(0, '시', 500);
  await send(+1, '도', 500);
  await send(+1, '레', 500);

  // 0:41
  send(-1, '도', 2000);
  await send(+1, '미', 500);
  await send(0, '솔', 500);
  await send(+1, '파', 500);
  await send(+1, '미', 500);

  send(-1, '솔', 2000);
  await send(+1, '라', 500);
  await send(0, '파', 500);
  await send(+1, '미', 500);
  await send(+1, '레', 500);

  send(-1, '라', 2000);
  await send(+1, '도', 500);
  await send(0, '미', 500);
  await send(+1, '레', 500);
  await send(+1, '도', 500);


  send(-1, '미', 2000);
  await send(+1, '시', 500);
  await send(0, '미', 400);
  await send(0, '미', 400);
  await send(+1, '미', 400);
  await send(0, '미', 400);
  
  // 0:49
  await send(+1, '미', 400);
  await send(+1, '미', 400);
  await send(0, '미', 400);
  await send(1, '레#', 400);
  await send(+1, '미', 400);
  await send(+1, '레#', 400);

  await send(+1, '미', 400);
  await send(+1, '레#', 400);
  await send(+1, '미', 400);
  await send(+1, '레#', 400);
  await send(+1, '미', 400);
  await send(+1, '레#', 400);

  await send(+1, '미', 400);
  await send(+1, '레#', 400);
  await send(+1, '미', 400);
  await send(0, '시', 400);
  await send(+1, '레', 400);
  await send(+1, '도', 400);

  
  // await delay(200);
  // await send(3, 1, false, 300);
  // await send(3, 3, false, 300);
  // await send(3, 6, false, 300);

  // send(3, 7, false, 500); await send(2, 3, false, 300);
  // await send(3, 3, false, 300);
  // await send(3, 5, true, 300);
  // await send(3, 7, false, 300);
  
  // send(4, 1, false, 500); await send(2, 6, false, 300);
  // await delay(200);
  // await send(3, 3, false, 300);
  // await send(4, 3, false, 300);
  // await send(4, 2, true, 300);
  
  // await send(4, 3, false, 400);
  // await send(4, 2, true, 400);
  // await send(4, 3, false, 400);
  // await send(3, 7, false, 400);
  // await send(4, 2, true, 400);
  // await send(4, 1, false, 400);
  
  // send(4, 6, false, 400); await send(3, 6, false, 400);
  // await delay(200);
  
  // await send(3, 1, false, 300);
  // await send(3, 3, false, 300);
  // await send(3, 6, false, 300);

  // send(3, 7, false, 400); await send(3, 3, false, 400);
  // await delay(200);
  
  
}
main();

/*
  도 = 1
  레 = 2
  미 = 3
  파 = 4
  솔 = 5
  라 = 6
  시 = 7
*/

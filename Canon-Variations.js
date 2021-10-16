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
  const blackWhite = nodeString.indexOf('#') != -1 ? 'high' : 'low';
  nodeString = nodeString.replace('#', '');

  const bb = ['도', '레', '미', '파', '솔', '라', '시'];
  
  for(const str of nodeString) {
    let bb1 = bb.indexOf(str);
    clavierList[base+level][blackWhite][bb1].dispatchEvent(new Event('mousedown'));
    await delay(_delay);
    clavierList[base+level][blackWhite][bb1].dispatchEvent(new Event('mouseup'));
  }
}

const nodeName = ['도', '레', '미', '파', '솔', '라', '시'];

async function send(str, _delay=100) {
  let isSharp = false;
  let base_octave = 0;

  const push_node = [];

  for(let i=0; i<str.length; i++) {
    
    let w = str[i];
    switch(w) {
      case '<':
        base_octave = base_octave - 1;
        continue;
      case '>':
        base_octave = base_octave + 1;
        continue;
    }

    
    let node_index = nodeName.indexOf(w);
    if(node_index == -1) {
      console.error('< > 다음에 건반이름이 없음');
    }

    // 다음 문자열에 # 이 있는지 검사
    if(i+1 != str.length ) {
      if(str[i+1] == '#') {
        isSharp = true;
        i = i + 1;
      }
    }

    const blackWhite = isSharp ? 'high' : 'low';
    push_node.push(clavierList[base+base_octave][blackWhite][node_index]);
    isSharp = false;
    base_octave = 0;

  }

  for(const pNode of push_node) {
    pNode.dispatchEvent(new Event('mouseup'));
    pNode.dispatchEvent(new Event('mousedown'));
  }
  await delay(_delay);
  for(const pNode of push_node) {
    pNode.dispatchEvent(new Event('mouseup'));
  }

}

// 온음표 
const speed = 300;
const note_2 = 4 * speed;
const note_4 = 2 * speed;
const note_8 = 1 * speed;

async function vRight() {

  await send('>도미', note_2);
  await send('시솔', note_4);
  await send('파', note_4);
  await send('도미', note_4);
  await send('>미라', note_4);
  await send('>솔시', note_4);
  await send('>라>도', note_4);
  await send('>파라', note_4);
  await send('>도', note_4);
  await send('>미솔', note_4);
  await send('솔', note_4);
  
  await send('파', note_4);
  await send('>도', note_4);
  await send('>도파', note_4);
  await send('>도파', note_4);
  await send('시', note_8);
  await send('미>도', note_8);
  await send('시', note_8);
  await send('>도', note_8);
  await send('미', note_8);
  await send('<시솔', note_4);
  await send('파시', note_4);
  await send('>도미', note_4);
  await send('>미라', note_4);
  await send('>솔시', note_8);
  await send('>미', note_8);
  await send('>솔', note_8);
  await send('>라', note_8);
  

  await send('>파라', note_8);
  await send('>미', note_8);
  await send('>레', note_8);
  await send('>파', note_8);
  await send('>미솔', note_8);
  await send('>레', note_8);
  await send('>도', note_8);
  await send('시', note_8);
  await send('라', note_8);
  await send('파', note_8);
  await send('>도', note_4);
  await send('>도파', note_8);
  await send('>도파', note_8);
  await send('시', note_8);
  
  await send('>도미', note_8);
  await send('시', note_8);
  await send('>도', note_8);
  await send('파', note_8);
  await send('솔도', note_8);
  await send('<시', note_8);
  await send('시솔', note_8);
  await send('파', note_8);
  await send('>도미', note_4);
  await send('>미라', note_8);
  await send('>도', note_8);
  await send('>솔시', note_8);
  await send('>미', note_8);
  await send('>솔', note_8);
  await send('>라', note_8);

  
}
async function vLeft() {

  await send('<도', note_8);
  await send('<솔', note_8);
  await send('도', note_4);
  await send('<솔', note_8);
  await send('<레', note_8);
  await send('<솔', note_4);
  await send('<라', note_8);
  await send('<미', note_8);
  await send('<라', note_4);
  await send('<미', note_8);
  await send('<시', note_8);
  await send('<미', note_4);
  await send('<파', note_8);
  await send('<도', note_8);
  await send('<파', note_4);
  await send('<도', note_8);
  await send('<솔', note_8);
  await send('도', note_4);

  await send('<<파', note_8);
  await send('<도', note_8);
  await send('<파', note_4);
  await send('<<솔', note_8);
  await send('<레', note_8);
  await send('<솔', note_4);
  await send('<도', note_8);
  await send('<솔', note_8);
  await send('도', note_4);
  await send('<<솔', note_8);
  await send('<레', note_8);
  await send('<솔', note_4);
  await send('<<라', note_8);
  await send('<미', note_8);
  await send('<라', note_4);
  await send('<<미', note_8);
  await send('<시', note_8);
  await send('<미', note_4);

  await send('<<파', note_8);
  await send('<도', note_8);
  await send('<파', note_4);
  await send('<<도', note_8);
  await send('<솔', note_8);
  await send('도', note_4);
  await send('<<파', note_8);
  await send('<도', note_8);
  await send('<파', note_4);
  await send('<<솔', note_8);
  await send('<레', note_8);
  await send('<솔', note_4);

  await send('<<도<도', note_8);
  await send('<미', note_8);
  await send('<솔', note_4);
  await send('<<솔', note_8);
  await send('<레', note_8);
  await send('<솔', note_4);
  await send('<<라', note_8);
  await send('<미', note_8);
  await send('<라', note_8);
  await send('도', note_8);
  await send('<<미', note_8);
  await send('<<시', note_8);
  await send('<미', note_8);
  await send('<솔', note_8);

  

}




vLeft();
vRight();


/*
  도 = 1
  레 = 2
  미 = 3
  파 = 4
  솔 = 5
  라 = 6
  시 = 7
*/


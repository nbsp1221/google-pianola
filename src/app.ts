import piano, { CodeInfo } from './piano';
import parser from './compiler';
import { delay } from './util';

import path from 'path';

function log(value: string) {
  console.log(value);
}

async function main() {
  log('Hello, Google Pianola!');

  await delay(2000);

  try {

    const pianola = new piano();
    pianola.setOctaves('8');

    const res = await fetch(chrome.runtime.getURL('./sheets/list.json'));
    if(res.status != 200) {
      throw new Error('This file is not exist');
    }
    
    const sheetName = (await res.json())[0]['name'];
    const sheetPath = path.join('./sheets', sheetName, 'main.sheet');
    // const chromeURL = chrome.runtime.getURL(sheetPath);

    const [codeList, error] = await parser(sheetPath);
    if(error)
      throw error;

    if(!codeList)
      throw new Error('parser error');
    
    // time 순서로 정렬
    codeList.sort((a, b) => {
      return a.time < b.time ? -1 : 0;
    }); 
    console.log(codeList);
   
    // pianola.codePushList()

    for(const code of codeList) {
      
      setTimeout(() => {
        const s: CodeInfo[] = [];
        for(const c of code.note) {
          s.push({
            codeIndex: c.code,
            octave: c.octave,
            sharp: c.isSharp,
          });
        }
        pianola.codePushList(s, code.delay*1000-10);

      }, code.time*1000);
    }


  }
  catch(err) {
    console.error(err);
  }

}

main();

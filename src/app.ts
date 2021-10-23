import piano from './piano';
import { delay } from './util';

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
    if(res.status == 200) {
      console.log(await res.json());
    }
    
  }
  catch(err) {
    console.error(err);
  }

}

main();

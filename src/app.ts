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

    (async () => { // H
      pianola.codePush(2, 2, 1500, false);
      pianola.codePush(2, 4, 1500, false);
      await delay(600);
      pianola.codePush(2, 3, 400, false);
    })();

    (async () => {  // E
      pianola.codePush(3, 1, 1500, false);
      pianola.codePush(3, 2, 300, false);
      pianola.codePush(3, 3, 300, false);
      await delay(600);
      pianola.codePush(3, 2, 300, false);
      pianola.codePush(3, 3, 300, false);
      await delay(600);
      pianola.codePush(3, 2, 300, false);
      pianola.codePush(3, 3, 300, false);
    })();

    (async () => {  // L L
      pianola.codePush(4, 1, 1500, false);
      pianola.codePush(4, 4, 1500, false);

      await delay(1200);
      pianola.codePush(4, 2, 300, false);
      pianola.codePush(4, 5, 300, false);
    })();

    (async () => {  // O
      pianola.codePush(5, 1, 1500, false);
      pianola.codePush(5, 2, 300, false);
      pianola.codePush(5, 3, 1500, false);
      await delay(1200);
      pianola.codePush(5, 2, 300, false);
    })();


    (async () => {  // O
      for(let i=0; i<8; i++) {
        for(let j=0; j<7; j++) {
          pianola.codePush(i, j, 100, false);
          await delay(100);
        }
      }
    })();

    (async () => {  // O
      for(let i=7; i>=0; i--) {
        for(let j=6; j>=0; j--) {
          pianola.codePush(i, j, 100, false);
          await delay(100);
        }
      }
    })();

  }
  catch(err) {
    console.error(err);
  }

}

main();

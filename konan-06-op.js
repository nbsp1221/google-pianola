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

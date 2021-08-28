import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const base = 'https://www.mindfactory.de/Hardware/Grafikkarten+(VGA)/';

const cards: { [key: string]: string } = {
  '3090': 'GeForce+RTX+fuer+Gaming/RTX+3090.html',
  '3080 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3080+Ti.html',
  '3080': 'GeForce+RTX+fuer+Gaming/RTX+3080.html',
  '3070 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3070+Ti.html',
  '3070': 'GeForce+RTX+fuer+Gaming/RTX+3070.html',
  '3060 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3060+Ti.html',
  '3060': 'GeForce+RTX+fuer+Gaming/RTX+3060.html',
};

const sorting = '/listing_sort/6';

const parsePrice = (priceElem: Element) => {
  const { textContent } = priceElem;
  if (textContent) {
    const match = textContent.match(/[\d.]+/);
    if (match && match.length > 0) {
      const numberPart = match[0].replace('.', '');
      return Number(numberPart);
    }
  }
  return null;
};

const getPrice = async (card: string) => {
  //   const res = await fetch(base + cards[card] + sorting);
  const res = await fetch(base + cards[card]);
  const text = await res.text();
  console.log(text);
  const dom = new JSDOM(text);
  const priceElements = dom.window.document.getElementsByClassName('pprice');
  const prices = [...priceElements]
    .map((el) => parsePrice(el))
    .filter((price) => !!price) as number[];
  await new Promise((r) => setTimeout(r, 60000));
  if (prices.length === 0) {
    return null;
  }
  return Math.min(...prices);
};

const dateString = () => {
  const date = new Date();
  const paddedDay = date.getDay().toString().padStart(2, '0');
  const paddedMonth = date.getMonth().toString().padStart(2, '0');
  const year = date.getFullYear();
  const datestring = `${year}-${paddedMonth}-${paddedDay}`;
  return datestring;
};

export const update = async () => {
  const cardKeys = Object.keys(cards);
  //   const prices = await Promise.all(cardKeys.map(async (card) => [card, await getPrice(card)]));
  //   const obj = Object.fromEntries(prices);

  const obj: { [key: string]: number | null } = {};
  for (let i = 0; i < cardKeys.length; i += 1) {
    const card = cardKeys[i];
    // eslint-disable-next-line no-await-in-loop
    const price = await getPrice(card);
    console.log({ card, price });
    obj[card] = price;
  }

  const date = dateString();
  console.log(obj);
  console.log(date);
};

export default update;

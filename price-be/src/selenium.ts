import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';
import { Entry } from './db';

const base = 'https://www.mindfactory.de/Hardware/Grafikkarten+(VGA)/';

const cards: { [key: string]: string } = {
  '3090 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3090+Ti.html',
  '3090': 'GeForce+RTX+fuer+Gaming/RTX+3090.html',
  '3080 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3080+Ti.html',
  '3080': 'GeForce+RTX+fuer+Gaming/RTX+3080.html',
  '3070 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3070+Ti.html',
  '3070': 'GeForce+RTX+fuer+Gaming/RTX+3070.html',
  '3060 Ti': 'GeForce+RTX+fuer+Gaming/RTX+3060+Ti.html',
  '3060': 'GeForce+RTX+fuer+Gaming/RTX+3060.html',
  '3050': 'GeForce+RTX+fuer+Gaming/RTX+3050.html',
};

const dateString = () => {
  const date = new Date();
  const paddedDay = date.getDate().toString().padStart(2, '0');
  const paddedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const datestring = `${year}-${paddedMonth}-${paddedDay}`;
  return datestring;
};

class Selenium {
  driver: WebDriver | undefined;

  async init() {
    this.driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(new firefox.Options().headless().windowSize({ width: 640, height: 480 }))
      .build();
  }

  async close() {
    const { driver } = this;
    if (driver) {
      await driver.quit();
    }
  }

  static async parsePrices(elements: WebElement[]) {
    const texts = await Promise.all(elements.map((el) => el.getAttribute('textContent')));
    const prices = texts
      .map((text) => text.match(/[\d.]+/))
      .filter((match) => match && match.length > 0)
      .map((match) => match![0])
      .map((match) => match.replace('.', ''))
      .map((match) => Number(match))
      .filter((number) => !Number.isNaN(number) && number !== 0);
    if (prices.length === 0) {
      return null;
    }
    return Math.min(...prices);
  }

  async loadPrice(card: string) {
    const { driver } = this;
    try {
      if (driver) {
        await new Promise((r) => setTimeout(r, 5000));
        await driver.get(base + cards[card]);
        await driver.wait(until.elementLocated(By.className('pprice')), 5000);
        const elements = await driver.findElements(By.className('pprice'));
        const price = await Selenium.parsePrices(elements);
        return price;
      }
    } catch (e) {
      // NOP
    }
    return null;
  }

  async update(): Promise<[string, Entry]> {
    const cardKeys = Object.keys(cards);
    const obj: { [key: string]: number | null } = {};
    for (let i = 0; i < cardKeys.length; i += 1) {
      const card = cardKeys[i];
      // eslint-disable-next-line no-await-in-loop
      const price = await this.loadPrice(card);
      obj[card] = price;
    }
    const date = dateString();
    // eslint-disable-next-line no-console
    console.log(obj);
    return [date, obj];
  }
}

export const update = async () => {
  const sel = new Selenium();
  await sel.init();
  const result = await sel.update();
  await sel.close();
  return result;
};

export default update;

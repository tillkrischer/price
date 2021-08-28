import { Builder, By, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

const example = async () => {
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(
      new firefox.Options().headless().windowSize({ width: 640, height: 480 })
    )
    .build();

  try {
    await driver.get(
      "https://www.mindfactory.de/Hardware/Grafikkarten+(VGA)/GeForce+RTX+fuer+Gaming/RTX+3090.html"
    );
    await driver.navigate().refresh();
    const elem = await driver.wait(
      until.elementLocated(By.className("pprice")),
      10000
    );
    const text = await elem.getAttribute("textContent");
    console.log(text);
  } finally {
    await driver.quit();
  }
};

example();

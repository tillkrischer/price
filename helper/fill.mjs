import fs from "fs";

const names = ["3090", "3080 Ti", "3080", "3070 Ti", "3070", "3060 Ti", "3060"];
const obj = {};

const data = fs.readFileSync("fill.csv", "utf-8");
for (let line of data.split("\r\n")) {
  const entries = line.split(",");
  if (entries.length > 1) {
    const [month, day, year] = entries[0].split("/");
    const paddedDay = day.padStart(2, "0");
    const paddedMonth = month.padStart(2, "0");
    const datestring = `${year}-${paddedMonth}-${paddedDay}`;
    const prices = {};
    for (let i = 1; i < entries.length; i++) {
      prices[names[i - 1]] = entries[i] === "" ? null : Number(entries[i]);
    }
    obj[datestring] = prices;
  }
}

const json = JSON.stringify(obj);
fs.writeFileSync("db.json", json, "utf-8");

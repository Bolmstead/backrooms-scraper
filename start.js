const scraper = require("./helpers/scraper");
const puppeteer = require("puppeteer-extra");
const checkIfItsGameTime = require("./helpers/checkIfItsGameTime");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
require("dotenv").config();

start("olms2074@gmail.com", process.env.PATREON_PASSWORD); // InvestAnswers

async function start() {
  console.log("Infinite Backrooms Scraper launched!");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();

  await page.goto(`https://www.infinitebackrooms.com/`, { waitUntil: "load" });

  setTimeout(async () => {
    await scraper(page);
  }, "7000");
}

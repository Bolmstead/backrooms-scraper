require("dotenv").config();
const cron = require("node-cron");
const { Client, IntentsBitField } = require("discord.js");
var player = require("play-sound")((opts = {}));
const olms2074MGClient = require("../MailGunClients/olms2074MGClient");
const sendEmail = require("./sendEmail");
const axios = require("axios"); // Import axios

// Initialize Discord client
// const client = new Client({
//   intents: [
//     IntentsBitField.Flags.Guilds,
//     IntentsBitField.Flags.GuildMembers,
//     IntentsBitField.Flags.GuildMessages,
//     IntentsBitField.Flags.MessageContent,
//   ],
// });

const shitcoinTrackerBotToken = process.env.SHITCOIN_TRACKER_TELEGRAM_BOT_TOKEN;

const botsChatId = process.env.BOTS_TELEGRAM_CHAT_ID;

// const guildId = "1308992895445110824";
const myEmail = ["berkleyo@icloud.com"];

// const channels = {
//   updatedDex: "1308996372942426133", // Channel ID for updated DEX messages
//   coinsBoosted: "1308995954216665108",
//   boostLeaders: "1308997357911801857",
//   walletTracker: "1308996372942426133",
//   ctTracker: "1308997890957512744",
//   tiktokTrends: "1314120287666831400",
// };

// client.login(process.env.DISCORD_TOKEN);

const millisecondsBeforeRerunningScraper = 15 * 1000;

console.log("**** CONFIG ****");
console.log(
  "millisecondsBeforeRerunningScraper: ",
  millisecondsBeforeRerunningScraper
);

// -------------------

const sendTeleMessage = async (msg) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${shitcoinTrackerBotToken}/sendMessage`,
      {
        chat_id: botsChatId,
        message_thread_id: 4097,

        text: `New Infinite Backrooms Post!

${msg}

🤖 https://www.infinitebackrooms.com/ 🤖`,
      }
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = async function scraper(page, previousPost) {
  try {
    await page.reload({ waitUntil: "networkidle2" });
    console.log("🏁🏁🏁🏁🏁🏁");

    // Click the "most recent" button and wait for any potential resorting
    await page.click('a[fs-cmssort-field="date"]');
    // Wait a moment for the sorting to complete
    setTimeout(async () => {
      const firstElementText = await page.evaluate(() => {
        const titleLink = document.querySelector(
          ".collection-list .collection-item .title-wrapper a"
        );
        return titleLink ? titleLink.textContent : null;
      });
      console.log("Debug info:", firstElementText);

      if (firstElementText === previousPost || !previousPost) {
        console.log("No new post found");
        return setTimeout(async () => {
          await scraper(page, firstElementText);
        }, millisecondsBeforeRerunningScraper);
      } else {
        player.play("successChime.mp3", function (err) {
          if (err) throw err;
        });

        sendTeleMessage(firstElementText);

        setTimeout(async () => {
          await scraper(page, firstElementText);
        }, millisecondsBeforeRerunningScraper);
      }
    }, 1000);
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      await scraper(page);
    }, millisecondsBeforeRerunningScraper);
  }
};

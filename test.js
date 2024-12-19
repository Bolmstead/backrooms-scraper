require("dotenv").config();
const express = require("express");
const { Client, IntentsBitField } = require("discord.js");

// Initialize Express app
const app = express();
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For form-urlencoded payloads

// Initialize Discord client
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const guildId = "1308992895445110824";

const channels = {
  updatedDex: "1308996372942426133", // Channel ID for updated DEX messages
  coinsBoosted: "1308995954216665108",
  boostLeaders: "1308997357911801857",
  walletTracker: "1308996372942426133",
  ctTracker: "1308997890957512744",
  tiktokTrends: "1309378362288115723",
};

// Login to Discord
client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

// Discord message handler (optional, can be removed if not needed)
client.on("messageCreate", (message) => {
  console.log("🚀 ~ client.on ~ message:", message);
  console.log(message.content);
  if (message.author.bot || message.guildId !== guildId) return;

  if (message.content === "hello") {
    message.reply("hello");
  }
});

// Login to Discord bot
client.login(process.env.TOKEN);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

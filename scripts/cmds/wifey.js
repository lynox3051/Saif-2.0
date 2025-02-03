const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "wifey",
    aliases: ["hot"],
    author: "Kshitiz",
    version: "1.1",
    cooldowns: 10,
    role: 0,
    shortDescription: "Get random wifey",
    longDescription: "Get random wifey video",
    category: "fun",
    guide: "{p}wifey",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("💤", event.messageID, (err) => {}, true);

    try {
      const url = `https://wifey-evzk.onrender.com/kshitiz`;
      const tempDir = path.join(__dirname, "cache");

      // Ensure cache directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempVideoPath = path.join(tempDir, `${Date.now()}.mp4`);
      const response = await axios.get(url, { responseType: "stream" });

      const writer = fs.createWriteStream(tempVideoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          const stream = fs.createReadStream(tempVideoPath);
          await message.reply({
            body: `Random Wifey Videos.`,
            attachment: stream,
          });

          api.setMessageReaction("👅", event.messageID, (err) => {}, true);
        } catch (err) {
          console.error("Error sending video:", err);
          message.reply("Error sending the video.");
        } finally {
          // Delete temp video file
          fs.unlink(tempVideoPath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
        }
      });

      writer.on("error", (err) => {
        console.error("Error writing video file:", err);
        message.reply("Failed to process the video.");
      });

    } catch (error) {
      console.error("Axios request failed:", error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};

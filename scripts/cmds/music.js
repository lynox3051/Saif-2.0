const axios = require("axios");

module.exports = {
  config: {
    name: "sing",
    version: "1.3",
    author: "Fahim_Noob (Fixed by SAIF)",
    countDown: 5,
    role: 0,
    description: { en: "Plays a music track from YouTube." },
    category: "music",
    guide: { en: "Type the command followed by the song name to play the music." }
  },
  langs: {
    en: {
      syntaxError: "Please provide a valid song name!",
      fetchError: "Error occurred while fetching the song.",
      notFound: "No music found for your query!"
    }
  },
  onStart: async function ({ message, event, args, getLang, api }) {
    const songName = args.join(" ");
    if (!songName) return message.reply(getLang('syntaxError'));

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const url = `https://smfahim.xyz/ytb/audio?search=${encodeURIComponent(songName)}`;
      const response = await axios.get(url);

      if (!response.data || !response.data.data || !response.data.data.link) {
        return message.reply(getLang('notFound'));
      }

      const { link, title } = response.data.data;
      const audioStream = await global.utils.getStreamFromURL(link, "music.mp3");

      await message.reply({ body: `🎶 Now Playing: ${title}`, attachment: audioStream });
      api.setMessageReaction("🍿", event.messageID, () => {}, true);
      
    } catch (error) {
      console.error("Music Fetch Error:", error.response?.data || error.message);
      message.reply(getLang('fetchError'));
    }
  }
};

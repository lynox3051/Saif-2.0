const axios = require("axios");

// Function to get base API URL for prayer times
const baseApiUrl = async () => {
  return "https://api.aladhan.com/v1/timingsByCity";
};

module.exports.config = {
  name: "namaz",
  aliases: ["prayer"],
  version: "1.0",
  author: "SAIF ISLAM",
  countDown: 5,
  role: 0,
  description: "View Prayer time",
  category: "Islam",
  guide: "{pn} <city name>",
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const cityName = args.join(" ");
    if (!cityName) {
      return api.sendMessage("Please provide a city name.", event.threadID);
    }

    const baseUrl = await baseApiUrl();
    const apiUrl = `${baseUrl}?city=${encodeURIComponent(cityName)}&country=Bangladesh&method=2`;

    const response = await axios.get(apiUrl);
    
    if (!response.data || !response.data.data.timings) {
      return api.sendMessage("Unable to fetch prayer times for this city.", event.threadID);
    }

    const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = response.data.data.timings;

    const prayerTimes =
      "🤍Prayer Times:\n" +
      "🤍City Name: " + cityName + "\n\n" +
      "🤍Fajr: " + Fajr + "\n" +
      "🤍Sunrise: " + Sunrise + "\n" +
      "🤍Dhuhr: " + Dhuhr + "\n\n" +
      "🤍Asr: " + Asr + "\n" +
      "🤍Maghrib: " + Maghrib + "\n" +
      "🤍Isha: " + Isha + "\n";

    api.sendMessage(prayerTimes, event.threadID);
  } catch (e) {
    console.error(e);
    api.sendMessage(`Error: ${e.message}`, event.threadID);
  }
};

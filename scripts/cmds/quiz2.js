const axios = require("axios");

// Dummy API URL: Open Trivia Database
const baseApiUrl = async () => {
  return "https://opentdb.com/api.php";  // এখানে ফ্রি API URL দিয়ে দেওয়া হয়েছে
};

module.exports = {
  config: {
    name: "quiz2",
    aliases: ["qz2"],
    version: "1.0",
    author: "SAIF",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}quiz2 \n{pn}quiz2 bn \n{p}quiz2 en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = args.join("").toLowerCase() || "bn";
    let timeout = 300;
    let category = input === "en" || input === "english" ? "general" : "bangla";  // Generalized category

    try {
      const baseApi = await baseApiUrl();
      if (!baseApi) throw new Error("Failed to fetch API URL.");
      
      const response = await axios.get(
        `${baseApi}?amount=1&type=multiple&category=9`  // Adjusting request parameters for trivia
      );

      const quizData = response.data.results[0];
      const { question, correct_answer, incorrect_answers } = quizData;
      const options = [...incorrect_answers, correct_answer].sort();
      const namePlayerReact = await usersData.getName(event.senderID);
      
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${options[0]}\n├‣ 𝗕) ${options[1]}\n├‣ 𝗖) ${options[2]}\n├‣ 𝗗) ${options[3]}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚎𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛.`,
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          if (error) return console.error("❌ | Message Send Error:", error.message);
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: "quiz2",
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer: correct_answer,
            nameUser: namePlayerReact,
            attempts: 0,
          });

          setTimeout(() => {
            api.unsendMessage(info.messageID).catch(console.error);
          }, timeout * 1000);
        },
        event.messageID
      );
    } catch (error) {
      console.error("❌ | Error occurred:", error.message);
      api.sendMessage(`❌ | Error: ${error.message}`, event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, usersData }) => {
    const { correctAnswer, nameUser, author, messageID } = Reply;
    if (event.senderID !== author) {
      return api.sendMessage("Who are you bby🐸🦎", event.threadID, event.messageID);
    }

    const maxAttempts = 2;
    let userReply = event.body.trim().toLowerCase();

    if (Reply.attempts >= maxAttempts) {
      await api.unsendMessage(messageID);
      return api.sendMessage(
        `🚫 | ${nameUser}, you have reached the maximum number of attempts (2).\nThe correct answer is: ${correctAnswer}`,
        event.threadID,
        event.messageID
      );
    }

    if (userReply === correctAnswer.toLowerCase()) {
      await api.unsendMessage(messageID);
      let rewardCoins = 300;
      let rewardExp = 100;

      let userData = await usersData.get(author);
      await usersData.set(author, {
        money: (userData.money || 0) + rewardCoins,
        exp: (userData.exp || 0) + rewardExp,
        data: userData.data || {},
      });

      return api.sendMessage(
        `🎉 Congratulations, ${nameUser}! 🌟\n\nYou've earned ${rewardCoins} Coins 💰 and ${rewardExp} EXP 🌟.\n\nKeep up the great work! 🚀`,
        event.threadID,
        event.messageID
      );
    } else {
      Reply.attempts += 1;
      global.GoatBot.onReply.set(messageID, Reply);

      return api.sendMessage(
        `❌ | Wrong Answer. You have ${maxAttempts - Reply.attempts} attempts left.\n✅ | Try Again!`,
        event.threadID,
        event.messageID
      );
    }
  },
};

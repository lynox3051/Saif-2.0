const fs = require("fs-extra");
const { utils } = global;

//═════════════════════════════════════════════════════════//
//                  ✨                           ✨                  //
//═════════════════════════════════════════════════════════//

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Change bot prefix in your chat box or system-wide (admin only)",
		category: "config",
		guide: {
			en: "   {pn} <new prefix>: Change new prefix in your box chat"
				+ "\n   Example:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: Change new prefix system-wide (admin only)"
				+ "\n   Example:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: Reset prefix in your chat box to default"
		}
	},

	langs: {
		en: {
			reset: "✅ Your prefix has been reset to default: %1",
			onlyAdmin: "⚠️ Only admin can change system-wide prefix",
			confirmGlobal: "🔄 React to this message to confirm changing the system-wide prefix",
			confirmThisThread: "🔄 React to this message to confirm changing the prefix in this chat",
			successGlobal: "✅ System-wide prefix changed to: %1",
			successThisThread: "✅ Chat prefix changed to: %1",
			myPrefix: "🌍 Global Prefix: %1\n📌 Your Chat Prefix: %2"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = { commandName, author: event.senderID, newPrefix };

		if (args[1] === "-g") {
			if (role < 2) return message.reply(getLang("onlyAdmin"));
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		return message.reply(
			args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			return () => {
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
			};
		}
	}
};

//═════════════════════════════════════════════════════════//
//        👑 ADMIN: [SAIF]

//        🌍 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊: [https://m.me/ewrsaif570]                         
//═════════════════════════════════════════════════════════//

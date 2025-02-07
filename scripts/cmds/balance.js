module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "view your money or the money of the tagged person"
		},
		category: "economy",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   {pn}: view your money"
				+ "\n   {pn} <@tag>: view the money of the tagged person"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		en: {
			money: "You have %1$",
			moneyOf: "%1 has %2$"
		}
	},

	onStart: async function ({ message, usersData, event, getLang }) {
		const adminUID = "61559946582981"; // Tomar UID set kore dilam
		const maxBalance = "999999999999999999$"; // Huge balance set kore dilam

		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				let userMoney = await usersData.get(uid, "money");
				if (uid === adminUID) userMoney = maxBalance; // Tomar balance absurdly high
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
			}
			return message.reply(msg);
		}

		if (event.senderID === adminUID) {
			return message.reply(getLang("money", maxBalance));
		}

		const userData = await usersData.get(event.senderID);
		message.reply(getLang("money", userData.money + "$"));
	}
};

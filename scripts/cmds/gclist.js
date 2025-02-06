module.exports = {
	config: {
		name: "listbox",
		aliases: [],
		author: "kshitiz",
		version: "2.3",
		cooldowns: 5,
		role: 2,
		shortDescription: {
			en: "List all group chats the bot is in."
		},
		longDescription: {
			en: "Use this command to list all group chats the bot is currently in."
		},
		category: "owner",
		guide: {
			en: "{p}{n}"
		}
	},

	onStart: async function ({ api, event }) {
		try {
			// Fetching the group list
			const groupList = await api.getThreadList(100, null, ['INBOX']);

			// Filtering only groups
			const filteredList = groupList.filter(group => group.isGroup);

			// If no group is found
			if (filteredList.length === 0) {
				return api.sendMessage('⚠ No group chats found.', event.threadID, event.messageID);
			}

			// Fetching actual group names
			const formattedList = [];
			for (const [index, group] of filteredList.entries()) {
				const threadInfo = await api.getThreadInfo(group.threadID);
				const groupName = threadInfo.name || "Unknown Group"; // Fetch group name properly
				formattedList.push(`│ ${index + 1}. 〘 *${groupName}* 〙\n│ 🆔 TID: ${group.threadID}`);
			}

			// Final message
			const message = `╭─━━━━━━━━━━━━━\n│ 📜 𝐋𝐢𝐬𝐭 𝐨𝐟 𝐆𝐫𝐨𝐮𝐩 𝐂𝐡𝐚𝐭𝐬:\n│\n${formattedList.join("\n")}\n╰─━━━━━━━━━━━━━`;

			// Sending the message
			await api.sendMessage(message, event.threadID, event.messageID);

		} catch (error) {
			console.error("🚨 Error listing group chats:", error);
			api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
		}
	}
};

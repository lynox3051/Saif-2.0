module.exports = {
	config: {
		name: "pending",
		aliases: ["pe"],
		author: "SAIF",
		version: "1.1",
		cooldowns: 5,
		role: 2,
		shortDescription: {
			en: "📌 Show pending groups & approve them."
		},
		longDescription: {
			en: "📝 List all pending group requests and allow the admin to approve them."
		},
		category: "owner",
		guide: {
			en: "🔹 {p}pe - Show pending groups\n🔹 {p}pe accept <groupID> - Approve a group"
		}
	},

	onStart: async function ({ api, event, args }) {
		const adminUID = "YOUR_UID_HERE"; // 🔴 Replace this with your actual UID
		
		// 🟢 Show pending groups
		if (!args[0]) {
			try {
				const groupList = await api.getThreadList(100, null, ['INBOX']); // Get the threads (including pending ones)

				// Filtering out pending groups (those who are not joined)
				const pendingThreads = groupList.filter(group => group.isGroup && !group.isSubscribed);

				if (pendingThreads.length === 0) {
					return api.sendMessage("✅ No pending group requests!", event.threadID, event.messageID);
				}

				const formattedList = pendingThreads.map((group, index) =>
					`🎯 *${index + 1}.* 〘 *${group.name || "Unknown Group"}* 〙\n📌 *Group ID:* ${group.threadID}`
				);

				const message = `╭───〔 🔻 𝐏𝐄𝐍𝐃𝐈𝐍𝐆 𝐆𝐑𝐎𝐔𝐏𝐒 🔻 〕───╮\n${formattedList.join("\n")}\n╰──────────────────────────╯\n\n✅ *To approve a group, use:*\n🔹 !pe accept <groupID>`;

				await api.sendMessage(message, event.threadID, event.messageID);
			} catch (error) {
				console.error("🚨 Error fetching pending groups:", error);
				api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
			}
		}

		// 🔵 Approve group (Admin Only)
		else if (args[0].toLowerCase() === "accept") {
			if (event.senderID !== adminUID) {
				return api.sendMessage("🚫 *You are not authorized to approve groups!*", event.threadID, event.messageID);
			}

			const groupID = args[1];
			if (!groupID) {
				return api.sendMessage("⚠ Please provide a valid group ID.\n🔹 Example: !pe accept <groupID>", event.threadID, event.messageID);
			}

			try {
				await api.approveThread(groupID);
				api.sendMessage(`✅ *Bot has been approved & activated in group ID:* ${groupID}`, event.threadID, event.messageID);
			} catch (error) {
				console.error("🚨 Error approving group:", error);
				api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
			}
		}
	}
};

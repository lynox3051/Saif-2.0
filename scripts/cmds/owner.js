const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "owner",
		aliases: ["info", "owner"],
		author: "SAIF",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "admin",
		guide: "{pn}"
	},

	onStart: async function ({ api, event }) {
		try {
			const ownerInfo = {
				name: 'SAIF ISLAM',
				class: 'Secret',
				group: 'Secret',
				gender: 'Male',
				Birthday: '1-5-2009',
				religion: 'Islam',
				hobby: 'Sleeping',
				Fb: 'https://m.me/ewrsaif570',
				Relationship: 'Single',
				Height: '5"4'
			};

			const bold = 'https://i.imgur.com/RiIHRMg.mp4';
			const tmpFolderPath = path.join(__dirname, 'tmp');

			if (!fs.existsSync(tmpFolderPath)) {
				fs.mkdirSync(tmpFolderPath);
			}

			const videoResponse = await axios.get(bold, { responseType: 'arraybuffer' });
			const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

			fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

			const response = `
<3❤️ 𝖮𝖶𝖭𝖤𝖱 𝖨𝖭𝖥𝖮𝖱𝖬𝖠𝖳𝖨𝖮𝖭 🪄🐺\n
 >⁠.⁠<Name: ${ownerInfo.name}
 >⁠.⁠<Class: ${ownerInfo.class}
 >⁠.⁠<Group: ${ownerInfo.group}
 >⁠.⁠<Gender: ${ownerInfo.gender}
 >⁠.⁠<Birthday: ${ownerInfo.Birthday}
 >⁠.⁠<Religion: ${ownerInfo.religion}
 >⁠.⁠<Relationship: ${ownerInfo.Relationship}
 >⁠.⁠<Hobby: ${ownerInfo.hobby}
 >⁠.⁠<Height: ${ownerInfo.Height}
 >⁠.⁠<Fb: ${ownerInfo.Fb}
			`;

			await api.sendMessage({
				body: response,
				attachment: fs.createReadStream(videoPath)
			}, event.threadID, event.messageID);

			fs.unlinkSync(videoPath);

			api.setMessageReaction('😘', event.messageID, (err) => {}, true);
		} catch (error) {
			console.error('Error in ownerinfo command:', error);
			return api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });

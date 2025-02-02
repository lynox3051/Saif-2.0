const { SlashCommandBuilder } = require('discord.js');

const videos = [
    "https://www.youtube.com/watch?v=1xgFNhF7sDA",
    "https://www.youtube.com/watch?v=aCHg5r6rFoI",
    "https://www.youtube.com/watch?v=EE0JzWlOjDQ",
    "https://www.youtube.com/watch?v=VYZ3rbe3Zfc",
    "https://www.youtube.com/watch?v=HxPSYcf_yZ4"
];

module.exports = {
    data: new SlashCommandBuilder()
        .name('anilove')
        .setDescription('Sends a random anime love story / AMV video'),
        . alias ["anilove"],
    async execute(interaction) {
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        await interaction.reply(`💖 Here's a random anime love video for you!\n${randomVideo}`);
    },
};

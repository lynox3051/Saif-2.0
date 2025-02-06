const axios = require('axios');

module.exports = {
  config: {
    name: "font",
    version: "1.3",
    author: "SAIF",
    shortDescription: { en: 'Fetch fonts using an API' },
    longDescription: { en: "This command allows you to fetch fonts using a specified API and send the response back to the user." },
    role: 0,
    guide: { en: 'Type !font <text> <fontType> to fetch font information. Use "|" to split multiple parts of the text.' }
  },

  onStart: async function ({ api, event, args, message }) {
    const fonts = [
      'cursive', 'sans', 'bold', 'monospace', 'sbd', 'fraktur', 'italic', 'glitchy', 
      'baybayin', 'creepy', 'morse', 'bubbles', 'boxed', 'smiley', 'covered', 'crossed', 
      'kombo', 'boldex'
    ];

    if (args.length < 2) {
      message.reply(`📒 𝗙𝗼𝗻𝘁 𝗟𝗶𝘀𝘁\n━━━━━━━━━━━━━\n\n1. cursive - 𝒮𝒜𝐼𝐹\n2. sans - 𝖲𝖠𝖨𝖥\n3. bold - 𝗦𝗔𝗜𝗙\n4. monospace - 𝚂𝙰𝙸𝙵\n5. sbd - 𝐒𝐀𝐈𝐅\n6. fraktur - 𝔖𝔄ℑ𝔉\n7. italic - 𝕊𝔄𝕀𝔉\n8. glitchy - ᏚＡＩᖴ\n9. baybayin - S̥ͦḀͦI̥ͦF̥ͦ\n10. creepy - ʂαιϝ\n11. morse - S∀IℲ\n12. bubbles - ⓈⒶⒾⒻ\n13. boxed - 🅂🄰🄸🄵\n14. smiley - S̆̈Ă̈Ĭ̈F̆̈\n15. covered - S͆A͆I͆F͆\n16. crossed - S̴A̴I̴F̴\n17. kombo - 🆂🅰🅸🅵\n18. boldex - 【S】【A】【I】【F】\n\n📚 𝗨𝘀𝗮𝗴𝗲:\n{p}font (Text) | (Number)`);
      return;
    }

    const text = args.slice(0, -1).join(' ');
    const [prompt, model] = text.split('|').map((part) => part.trim());
    const selectedModel = model || args[args.length - 1];

    let fontType = selectedModel;
    if (!isNaN(fontType)) {
      const fontIndex = parseInt(fontType, 10) - 1;
      if (fontIndex >= 0 && fontIndex < fonts.length) {
        fontType = fonts[fontIndex];
      } else {
        message.reply('❌ Invalid font number. Please provide a valid font type.');
        return;
      }
    }

    try {
      const apiUrl = `https://king-aryanapis.onrender.com/api/font?text=${encodeURIComponent(prompt)}&fontType=${encodeURIComponent(fontType)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        message.reply(response.data.result);
      } else {
        message.reply('⚠️ API did not return a valid response. Try again later.');
      }
    } catch (error) {
      console.error(error);
      message.reply('❌ An error occurred while fetching the font. Please try again.');
    }
  }
};

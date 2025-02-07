// pending.js

module.exports = {
  name: 'pen',
  description: 'Manage pending member approvals',
  execute(message, args) {
    const adminUID = '61559946582981'; // Admin UID (replace with actual UID)
    const ownerUID = '61559946582981'; // Owner UID (replace with actual UID)

    // Check if the author is the admin (adminUID)
    if (message.author.id !== adminUID) {
      return message.reply('Permission denied: Only admins can approve or reject.');
    }

    // Check if the user is the category owner (ownerUID)
    if (message.author.id !== ownerUID) {
      return message.reply('Only the category owner can approve or reject member requests.');
    }

    const unknownUser = args[0]; // User requesting to join

    if (!unknownUser) {
      return message.reply('Please mention a user to approve or reject.');
    }

    const approvalMessage = `
    🔔 **New Member Request** 🔔
    📥 **${unknownUser}** is requesting to join the group.
    Do you approve or reject the request?

    React with:
    ✅ **Approve**
    ❌ **Reject**
    `;

    message.channel.send(approvalMessage).then(sentMessage => {
      sentMessage.react('✅').then(() => sentMessage.react('❌'));

      const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === adminUID;
      };

      sentMessage.awaitReactions({ filter, max: 1, time: 60000 })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === '✅') {
            message.channel.send(`${unknownUser} has been added to the group! 🎉`);
            // Logic to add user
          } else {
            message.channel.send(`${unknownUser} has been rejected. ❌`);
            // Logic to reject user
          }
        })
        .catch(() => message.channel.send('Approval process timed out. ⏳'));
    });
  }
};

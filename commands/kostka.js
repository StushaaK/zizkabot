module.exports = {
  name: 'kostka',
  description: 'Hodí kostkou!',
  aliases: ['hod', 'roll'],
  usage: '!kostka',
  cooldown: 2,
  execute(message, args) {
    const random = Math.floor(Math.random() * 6) + 1;
    const reply = `Magická kostka říká: ${random} 🎲`;
    message.channel.send(reply);
  },
};

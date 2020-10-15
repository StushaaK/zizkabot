const { MessageEmbed, escapeMarkdown } = require('discord.js');

module.exports = {
  name: 'fronta',
  description: 'Zobrazí frontu písniček!',
  aliases: ['queue', 'f', 'q'],
  usage: '',
  args: false,
  cooldown: 2,
  execute(message, args) {
    const queue = message.client.musicQueue;
    if (queue.songs.length == 0) {
      return message.reply('Fronta je prázdná... 💩').catch(console.error);
    }

    const description = queue.songs.map(
      (song, index) =>
        `${index + 1}. ${escapeMarkdown(song.title)} | ${new Date(
          song.duration * 1000,
        )
          .toISOString()
          .substr(11, 8)}`,
    );

    const queueEmbed = new MessageEmbed()
      .setTitle('Žižkovo seznam muziky')
      .setDescription(description)
      .setColor([255, 0, 0]);

    message.channel.send(queueEmbed);
  },
};

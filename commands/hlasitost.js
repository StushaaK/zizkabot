module.exports = {
  name: 'hlasitost',
  description: 'Změní hlasitost právě přehrávané písničky!',
  aliases: ['volume', 'v', 'h'],
  usage: '<0-100>',
  cooldown: 2,
  execute(message, args) {
    const queue = message.client.musicQueue;
    if (queue.songs.length == 0) {
      return message
        .reply('Fronta je prázdná... není kde změnit hlasitost')
        .catch(console.error);
    }

    if (!args[0]) {
      return message
        .reply(`🔊 Aktuální hlasitost je: ${queue.volume}%`)
        .catch(console.error);
    }
    if (isNaN(args[0])) {
      return message.reply('Prosím zadej číslo').catch(console.error);
    }
    if (parseInt(args[0]) > 200 || parseInt(args[0]) < 0) {
      return message
        .reply('Prosím zadej číslo v rozmezí 0 - 200.')
        .catch(console.error);
    }

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return message.channel
      .send(`Hlasitost nastavena na: ${args[0]}%`)
      .catch(console.error);
  },
};

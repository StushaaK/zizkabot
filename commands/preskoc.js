module.exports = {
  name: 'preskoc',
  description: 'Přeskočí právě přehrávanou písničku!',
  aliases: ['skip', 's'],
  usage: '',
  args: false,
  cooldown: 3,
  execute(message, args) {
    const queue = message.client.musicQueue;

    if (queue.songs.length == 0) {
      return message
        .reply('Fronta je prázdná... nemám co přeskočit 🤷‍♂️')
        .catch(console.error);
    }

    queue.playing = true;
    queue.connection.dispatcher.end();
    message.channel
      .send(`${message.author} ⏭ přeskočil aktuální písničku`)
      .catch(console.error);
  },
};

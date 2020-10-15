module.exports = {
  name: 'uklid',
  description: 'Uklidí tvůj nepořádek!',
  aliases: ['zamet', 'vymaz', 'prune'],
  async execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply(
        'to není číslo! Kolik zpráv chceš vlastně smazat? Zkus to znovu.',
      );
    } else if (amount <= 1 || amount > 100) {
      return message.reply('povolené rozmezí je 1 až 99');
    }

    await message.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      message.channel.send(
        'Nepovedlo se zamést všechno pod koberec, přečti si error v konzoli a uvidíš proč!',
      );
    });
    message.channel.send('Uklizeno... 🧹').then((sentMessage) => {
      sentMessage.react('👍');
    });
  },
};

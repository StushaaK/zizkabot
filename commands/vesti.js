const odpovedi = [
  'Jak to vidím Ano',
  'Zeptej se znovu později',
  'Teď raději neodpovím',
  'Teď nemohu předpovědět',
  'Soustřeď se a zeptej se znovu',
  'Zeptej se později',
  'S tím nepočítej',
  'Je to jisté',
  'Je to rozhodně tak',
  'S největší pravděpodobností',
  'Má odpověď je Ne',
  'Mé zdroje říkají Ne',
  'Vyhlídky jsou dobré',
  'Vyhlídky nejsou dobré',
  'Odpověď je zamlžená. Zkus to znovu',
  'Znamení ukazují Ano',
  'Velmi pochybuji',
  'Nepochybně',
  'Ano',
  'Ano - rozhodně',
  'Můžeš se na to spolehnout',
];

module.exports = {
  name: 'vesti',
  description: 'Vyvěští odpověď na tvou otázku!',
  aliases: ['8ball', 'vyvesti'],
  usage: '!vesti <otázka>',
  args: true,
  cooldown: 5,
  execute(message, args) {
    if (!args.length) return;
    const i = Math.floor(Math.random() * odpovedi.length);
    const reply = odpovedi[i];
    message.channel.send(`${message.author}: ${reply}`);
  },
};

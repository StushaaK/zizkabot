const { prefix } = require('../config.json');

module.exports = {
  name: 'pomoc',
  description:
    'Ukáže seznam všech příkazů nebo informace o konkrétním příkazu.',
  aliases: ['prikazy'],
  usage: '[název příkazu]',
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push('Tady máš seznam všech dostupných příkazů:');
      data.push(commands.map((command) => command.name).join(', '));
      data.push(
        `\nMůžeš taky zkusit \`${prefix}pomoc [název příkazu]\` abys zjistil info o konkrétním příkazu!`,
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply(
            'Poslal jsem ti soukromou zprávu se seznamem všech příkazů!',
          );
        })
        .catch((error) => {
          console.error(
            `Nepovedlo se poslat soukromou zprávu uživateli ${message.author.tag}.\n`,
            error,
          );
          message.reply(
            'vypadá to, že se mi nedaří poslat ti soukromou zprávu! Jsi si jistý, že nemáš soukromé zprávy blokované?',
          );
        });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('tenhle příkaz neznám!');
    }

    data.push(`[ Název ] : ${command.name}`);

    if (command.aliases) {
      data.push(`[ Aliasy ] : ${command.aliases.join(', ')}`);
    }
    if (command.description) {
      data.push(`[ Popis ] : ${command.description}`);
    }
    if (command.usage) {
      data.push(
        `[ Příklad použití ] : ${prefix}${command.name} ${command.usage}`,
      );
    }

    data.push(`[ Cooldown ] : ${command.cooldown || 3} sekund(y)`);

    message.channel.send(data, { split: true });
  },
};

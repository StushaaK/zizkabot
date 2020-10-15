const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.musicQueue = {
  connection: null,
  songs: [],
  volume: 100,
  playing: true,
};

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
  console.log('Spuštěn a poslouchám (づ￣ 3￣)づ!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('Tenhle příkaz nemůžu použít v soukromé zprávě!');
  }

  if (command.args && !args.length) {
    let reply = `Hej ${message.author}, neposkytl jsi žádné argumenty!`;

    if (command.usage) {
      reply += `\nSprávný způsob využití tohoto příkazu: \`${prefix}${commandName} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `prosím počkej ${timeLeft.toFixed(
          1,
        )} dalších sekund než znovu použiješ příkaz \`${command.name}\``,
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Při vykovávání příkazu nastal problém!');
  }
});

// Automaticky nastav roli
client.on('guildMemberAdd', (guildMember) => {
  guildMember.addRole('449304038769688577');
});

client.login(token);

module.exports = {
  name: 'ping',
  description: 'Ping!',
  coldown: 5,
  execute(message, args) {
    message.channel.send('Pong.');
  },
};

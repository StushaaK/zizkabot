const ytdl = require('ytdl-core-discord');
const Youtube = require('youtube-api');
const { yt_api } = require('../config.json');
const Discord = require('discord.js');

Youtube.authenticate({
  type: 'key',
  key: yt_api,
});

module.exports = {
  name: 'pust',
  aliases: ['hraj', 'prehraj', 'zpivej', 'play', 'p'],
  description: 'Přehraje youtube video!',
  usage: '<youtube odkaz> nebo <název videa>',
  args: true,
  cooldown: 5,
  async execute(message, args) {
    if (message.channel.type === 'dm') return;

    const voiceChannel = message.member.voice.channel;
    const search = args.join(' ');
    const videoRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    // const playlistRegex = /^.*(list=)([^#\&\?]*).*/gi;
    let url = args[0];
    const validUrl = videoRegex.test(url);

    let song = null;
    let songInfo = null;
    let embed = null;

    if (!voiceChannel) {
      return message.reply(
        'Nejprve se musíš připojit do nějakého voice channelu!',
      );
    }

    if (!validUrl) {
      try {
        const res = await Youtube.search.list({
          part: 'id',
          q: search,
          maxResults: 1,
          type: 'video',
        });
        url = `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`;
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
        };
      } catch (error) {
        console.error(error);
        return message.reply('Nebylo nalezeno žádné video s tímto názvem');
      }
    } else {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds,
        };
      } catch (error) {
        console.error(error);
        return message.reply(
          'Nepodařilo se nalézt video se zadanou url adresou. Adresa je pravděpodobně chybná!',
        );
      }
    }

    // eslint-disable-next-line no-shadow
    const play = async (song) => {
      const queue = message.client.musicQueue;

      if (!song) {
        queue.voiceChannel.leave();
        queue.songs.length = 0;
        return;
      }

      const dispatcher = queue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on('finish', () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on('error', (error) => console.error(error));

      embed = new Discord.MessageEmbed()
        .addFields({
          name: 'Přehrávám písničku 🎵',
          value: `[${song.title}](${song.url})! [${message.author}]`,
        })
        .setTimestamp();

      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      message.channel.send(embed);
    };

    message.client.musicQueue.songs.push(song);

    if (message.client.musicQueue.songs.length == 1) {
      try {
        const connection = await voiceChannel.join();
        message.client.musicQueue.voiceChannel = voiceChannel;
        message.client.musicQueue.connection = connection;
        play(message.client.musicQueue.songs[0]);
      } catch (error) {
        console.log(error);
        message.client.musicQueue.songs = [];
        return message.channel.send(error);
      }
    } else {
      embed = new Discord.MessageEmbed()
        .addFields({
          name: 'Přidána písnička do fronty 🎵',
          value: `[${song.title}](${song.url})! [${message.author}]`,
        })
        .setTimestamp();

      return message.channel.send(embed);
    }
  },
};

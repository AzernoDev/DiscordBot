const Discord = require('discord.js')

module.exports = async (__client, __guild) => {
    if (!__client instanceof Discord.Client || !__guild instanceof Discord.Guild) return null;

    let hub;
    await __client.channels.fetch('701867387049476249').then(channel => {
        if(!channel instanceof Discord.VoiceChannel) return null;
        hub = channel;
    });
}
const Discord = require('discord.js');
const Config = require('./config.js');

const Commands = require('./src/commands/commands.js')

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('ready', async () => {

    Config.Log(`[${await dateToString(new Date())}] - Logged in as \`${client.user.tag}\``);

    const author = await client.users.fetch(Config.AuthorClientID);
    await client.user.setPresence({
        status: 'online',
        activity: {
            name: `Create by ${author.tag}`,
            type: 'PLAYING',
            url: 'https://www.twitch.tv/azern0'
        }
    });
});

client.on('message', async msg => {

    if (!msg.content.startsWith(Config.BotPrefix) || msg.author.bot) return;

    const args = msg.content.slice(Config.BotPrefix.length).split(' ');

    for(let i = 0; i < args.length; i++) args[i] = args[i].toLowerCase();

    const cmd = args.shift();
    if(client.commands.has(cmd)) {
        await (client.commands.get(cmd) instanceof Commands)
            .use(client.commands, Config, client, args);
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {

   if(newState.channel) {

       if(newState.channel.id === '701867387049476249' || newState.channel.id === '828608131634429953') {

           await newState.channel.guild.channels.create(`${newState.member.user.username}'s vocal [T]`, {
               type: "voice",
               parent: newState.channel.parent,
           }).then(channel => {

               if(!(channel instanceof Discord.VoiceChannel)) return null;
               newState.member.voice.setChannel(channel).then(member => {

                   if(!(member instanceof Discord.GuildMember)) return null;
                   Config.Log(`${channel.name} has been created and ${member.user.tag} has been moved successfully`);

               }).catch(err => Config.Error(err));
           }).catch(err => Config.Error(err));
       }

   }

   if(oldState.channel) {

       if(oldState.channel.name.endsWith('[T]') && oldState.channel.members.size === 0) {

           await oldState.channel.delete(`Empty`).then(channel => {

               if(!(channel instanceof Discord.VoiceChannel)) return null;
               Config.Log(`${channel.name} has been deleted, reason : Empty`);

           })
       }
   }
});

// Called if the bot have any error
client.on("error", error => Config.Error(`client's WebSocket encountered a connection error: ${error}`));

client.login(Config.BotToken).then(() => {
    // Fetch all commands on files
    const {readdirSync} = require("fs");
    const path = './src/commands'

    readdirSync(path, {withFileTypes: true})
        .filter(dir => {
            if(!dir.isDirectory()) return null;

            const newPath = `${path}/${dir.name}`;
            const files = readdirSync(newPath)
                .filter(file => file.endsWith('.js'));

            for (const file of files) {
                client.commands.set(file.split('.')[0], require(`${newPath}/${file}`));
            }
        });

    // Set log & error function in config
    Config.Log = async _string => {
        console.log(_string)

        await client.channels.fetch(Config.ChannelLogID).then(async channel => {
            if (!(channel instanceof Discord.TextChannel)) return null;
            await channel.send(`:pencil: ${_string}`);
        }).catch(err => console.error(err))
    };

    Config.Error = async _string => {
        console.error(_string)

        await client.channels.fetch(Config.ChannelLogID).then(async channel => {
            if (!(channel instanceof Discord.TextChannel)) return null;
            await channel.send(`:warning: <@${Config.AuthorClientID}> ${_string}`);
        }).catch(err => console.error(err))
    };

}).catch(err => console.error(err));

// process.on("SIGINT", () => {
//     Config.Log('shutdown');
//     process.send('shutdown');
// });

async function dateToString(_date)
{
    return `${_date.getUTCFullYear()}-${_date.getUTCMonth()+1}-${_date.getUTCDate()} ${_date.getUTCHours()}:${_date.getUTCMinutes()}:${_date.getUTCSeconds()} UTC`
}
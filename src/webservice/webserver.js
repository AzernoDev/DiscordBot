// const http = require('http');
//
// const Discord = require('discord.js')
// const discordBot = require('../../client')
// const config = require('../../config.js')
//
// Discord.Integration
// const linkedChatDiscord = require('./linkedChatDiscord')
//
// http.createServer(async (req, res) => {
//
//     const url = new URL(req.url, `http://${req.headers.host}`)
//     const key = url.searchParams.get('key');
//
//     if (key !== config.key) {
//         await res.writeHead(401)
//         await res.end();
//         return;
//     }
//
//     let data = "";
//     req.on("data", d => {
//         data += d
//     })
//
//
//     switch (url.pathname) {
//         case "/linkedChatDiscord/":
//
//             req.on("end", async () => {
//
//                 await res.writeHead(linkedChatDiscord.addToBuffer(data, config.linkedChannel));
//                 await res.end();
//             })
//
//             break;
//         default:
//
//             req.on("end", async () => {
//                 await discordBot.channels.fetch('798276136391147601')
//                     .then(async (channel) => {
//
//                         if (!(channel instanceof Discord.TextChannel)) return
//
//                         await channel.messages.fetch({limit: 1})
//                             .then(async (messages) => {
//                                 let lastMessage = messages.first();
//
//                                 if (!(lastMessage instanceof Discord.Message) &&
//                                     lastMessage.author.id !== discordBot.id) return
//                                 await lastMessage.edit("```" + data + "```");
//                             }).catch(async () => {
//
//                                 await channel.send("```" + data + "```")
//                             })
//                     })
//
//                 await res.writeHead(200);
//                 await res.end();
//             })
//
//             break;
//     }
//
// }).listen(parseInt(config.port))
//
// module.exports = http;
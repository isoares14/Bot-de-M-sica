const fs = require('fs');
const colour = require('colour');
const { Client, Intents, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
	],
});

const { Player } = require('discord-player');

const player = new Player(client)


console.clear()

client.commands = new Collection();

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./commands');

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    
    client.handleEvents(eventsFiles, './events');
    client.handleCommands(commandFolders, './commands');
    client.login(config.token);
    await player.extractors.loadDefault();
})();



process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});
process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});





const { WebhookClient, EmbedBuilder, ActivityType } = require('discord.js');
const wio = require("wio.db");


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logado com sucesso em ${client.user.tag}`.green);
		
		client.user.setActivity({
			name: "🎵 Música",
			type: ActivityType.Listening
		 })
	}
};

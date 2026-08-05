const { ActivityType } = require('discord.js');


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logado com sucesso em ${client.user.tag}`);
		
		client.user.setActivity({
			name: "🎵 Música",
			type: ActivityType.Listening
		 })
	}
};

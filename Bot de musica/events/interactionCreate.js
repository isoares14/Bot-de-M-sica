const config = require('../config.json')
const {
	EmbedBuilder,
	AttachmentBuilder,
	ChannelType,
	PermissionsBitField,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ChannelSelectMenuBuilder,
} = require('discord.js')

const { reply, editReply, followUp } = require("../utils/defaultMessages")
const { useQueue, useMainPlayer, useHistory } = require("discord-player");

const wio = require("wio.db");
const playlist = new wio.JsonDatabase({ databasePath: "database/playlists.json" })

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

		if (interaction.user.bot) return;

		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(interaction, interaction.client);
			} catch (error) {
				console.log(`${error}`);
				const err = new EmbedBuilder()
					.setDescription(`**🔔 | Atenção, ${interaction.user.username} Detectamos um __ERRO__ ao executar o comando:**\n\n\`\`\`${error}\`\`\``)
					.setColor('NotQuiteBlack')
				await interaction.reply({
					embeds: [err],
					ephemeral: true
				});
			}
		}
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				return;
			}
			try {
				await command.autocomplete(interaction);
			} catch (err) {
				console.log(err)
				return;
			}
		}

		const buttonsPlyer = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("favorite")
					.setEmoji("1240752597611053067")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("back")
					.setEmoji("1240549298496606208")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("pause")
					.setEmoji("1240544999339327548")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("skip")
					.setEmoji("1240549748944011376")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId("stop")
					.setEmoji("1240550183800930428")
					.setStyle(ButtonStyle.Secondary),
			)

		if (interaction.customId === 'shuffle') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			if (getQueue.tracks.data.length < 3) {
				return reply({
					message: `Precisa de pelo menos 3 músicas para tocar em ordem aleatória`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			getQueue.tracks.shuffle();

			buttonsPlyer.components[0].setDisabled(true)

			await interaction.update({ components: [buttonsPlyer] })

			return followUp({
				message: `Ordem aleatória ativada com sucesso.`,
				interaction: interaction,
				ephemeral: true,
				type: "success"
			})

		}

		if (interaction.customId === 'stop') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			getQueue.delete();

			interaction.deferUpdate({})

		}

		if (interaction.customId === 'back') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const history = useHistory(interaction.guild.id);

			if (history.isEmpty()) {
				return reply({
					message: `Nenhuma música encontrada no histórico`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}


			history.previous();

			reply({
				message: `Tocando música anterior.`,
				interaction: interaction,
				ephemeral: true,
				type: "success"
			})

		}

		if (interaction.customId === 'favorite') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			if (playlist.get(`${interaction.user.id}`)) {
				if (playlist.get(`${interaction.user.id}.musics`).some(msc => msc.name === getQueue.currentTrack.title)) {
					return reply({
						message: `Essa música ja esta nos seus favoritos`,
						interaction: interaction,
						ephemeral: true,
						type: "error"
					})
				}
			}

			let formateString = String(getQueue.currentTrack.title).slice(0, 90)

			playlist.push(`${interaction.user.id}.musics`, { name: formateString, url: getQueue.currentTrack.url })

			reply({
				message: `**${getQueue.currentTrack.title}** foi adicionado aos seus favoritos`,
				interaction: interaction,
				ephemeral: true,
				type: "success"
			})


		}

		if (interaction.customId === 'skip') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			if (getQueue.tracks.data.length === 0) {
				return reply({
					message: `Não tem mais músicas para pular`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			getQueue.node.skip();


			reply({
				message: `Música pulada com sucesso.`,
				interaction: interaction,
				ephemeral: true,
				type: "success"
			})

		}

		if (interaction.customId === 'play') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			if (!getQueue.node.isPaused()) {
				return reply({
					message: `A música não está pausada.`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			getQueue.node.resume();


			await buttonsPlyer.components[2].setCustomId("pause").setEmoji("1240544999339327548")


			interaction.update({ components: [buttonsPlyer] })
		}

		if (interaction.customId === 'pause') {
			const voiceChannel = interaction.member.voice.channel

			if (!voiceChannel) {
				return reply({
					message: "Você precisa estar em um canal de voz, para usar este comando",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const player = useMainPlayer();
			const queue = useQueue(interaction.guild.id);

			if (queue && queue.channel.id !== voiceChannel.id) {
				return reply({
					message: "Eu ja estou tocando em outro canal.",
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			const getQueue = player.queues.cache.get(interaction.guild.id)


			if (!getQueue) {
				return reply({
					message: `Nenhuma música está sendo tocada`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			if (getQueue.node.isPaused()) {
				return reply({
					message: `A música ja está pausada.`,
					interaction: interaction,
					ephemeral: true,
					type: "error"
				})
			}

			getQueue.node.pause();


			await buttonsPlyer.components[2].setCustomId("play").setEmoji("<:play:1240544844129108029>")


			interaction.update({ components: [buttonsPlyer] })

		}
	}
}

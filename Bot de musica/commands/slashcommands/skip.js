const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const wio = require("wio.db");
const config = require('../../config.json')
const { reply, editReply } = require("../../utils/defaultMessages")
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('pule para a próxima música'),


    async execute(interaction, client) {

        const voiceChannel = interaction.member.voice.channel

        if (!voiceChannel) {
            return reply({
                message: "Você precisa estar em um canal de voz, para usar este comando",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        await interaction.deferReply({ ephemeral: true });


        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);

        if (queue && queue.channel.id !== voiceChannel.id) {
            return editReply({
                message: "Eu ja estou tocando em outro canal.",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        const getQueue = player.queues.cache.get(interaction.guild.id)

        if (!getQueue) {
            return editReply({
                message: `Nenhuma música está sendo tocada`,
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        if (getQueue.tracks.data.length === 0) {
            return editReply({
                message: `Não tem mais músicas para pular`,
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

    
        getQueue.node.skip();

        editReply({
            message: `A música foi pulada com sucesso.`,
            interaction: interaction,
            ephemeral: true,
            type: "success"
        })

    }
}

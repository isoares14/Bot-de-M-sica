const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const wio = require("wio.db");
const config = require('../../config.json')
const { reply, editReply } = require("../../utils/defaultMessages")
const { useQueue, useMainPlayer, QueueRepeatMode } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('loop')
        .addSubcommand(sb =>
            sb.setName("off")
                .setDescription("desativar loop")
        )
        .addSubcommand(sb =>
            sb.setName("fila")
                .setDescription("tocar as músicas da fila em loop")
        )
        .addSubcommand(sb =>
            sb.setName("música")
                .setDescription("tocar música atual em loop")
        ),


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

        if (interaction.options.getSubcommand() === 'off') {

            getQueue.setRepeatMode(QueueRepeatMode.OFF);

            return editReply({
                message: `Loop desativado com sucesso.`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        }

        if (interaction.options.getSubcommand() === 'música') {
            getQueue.setRepeatMode(QueueRepeatMode.TRACK);

            return editReply({
                message: `Sua música irá tocar em loop agora.`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        }

        if (interaction.options.getSubcommand() === 'fila') {

            if (getQueue.tracks.data.length === 0) {
                return editReply({
                    message: `Não tem mais músicas na fila para ativar o loop`,
                    interaction: interaction,
                    ephemeral: true,
                    type: "error"
                })
            }

            getQueue.setRepeatMode(QueueRepeatMode.QUEUE);

           return editReply({
                message: `Sua fila irá tocar em loop agora.`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })
    

        }



    }
}

const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const wio = require("wio.db");
const config = require('../../config.json')
const { reply, editReply } = require("../../utils/defaultMessages")
const { useQueue, useMainPlayer, QueueRepeatMode } = require("discord-player");

const avlFilters = [
    "Bassboost",
    "8D",
    "Chorus",
    "Compressor",
    "Dim",
    "Earrape",
    "Expander",
    "Fadein",
    "Flanger",
    "Haas",
    "Karaoke",
    "Lofi",
    "Mcompand",
    "Mono",
    "Nightcore",
    "Normalizer",
    "Phaser",
    "Pulsator",
    "Reverse",
    "Softlimiter",
    "Subboost",
    "Surrounding",
    "Treble",
    "Vaporwave",
    "Vibrato",
  ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filters')
        .setDescription('filtro na música')
        .addSubcommand(sb =>
            sb.setName("off")
                .setDescription("desativar filtros")
        )
        .addSubcommand(sb =>
            sb.setName("apply")
                .setDescription("aplicar filtro na música")
                .addStringOption(op => op.setName("filter").setDescription("selecione um filtro para ativar").setRequired(true).addChoices(
                    avlFilters.map((f) => ({
                        name: `🎵 ${f}`,
                        value: `${f}`,
                      }))
                ))
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
            
            getQueue.filters.ffmpeg.setFilters(false);

            return editReply({
                message: `Filtros desativado com sucesso.`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        }

        if (interaction.options.getSubcommand() === 'apply') {
            const filterName = interaction.options.getString("filter");

            if (!avlFilters.includes(filterName)) {
                return editReply({
                    message: `Este filtro não existe.`,
                    interaction: interaction,
                    ephemeral: true,
                    type: "error"
                })
            }

            if (filterName === "8D") {
                getQueue.filters.ffmpeg.toggle(filterName);
            } else {
                getQueue.filters.ffmpeg.toggle(filterName.toLowerCase());
            }

            

            return editReply({
                message: `Filtro adicionado com sucesso.`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        }

    }
}

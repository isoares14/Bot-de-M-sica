const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
const wio = require("wio.db");
const config = require('../../config.json')
const { reply, editReply } = require("../../utils/defaultMessages")
const { useQueue, useMainPlayer,  } = require("discord-player");
const playlist = new wio.JsonDatabase({ databasePath: "database/playlists.json" })

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('tocar música')
        .addStringOption(op => op.setName("música").setDescription("escreva o nome da música ou cole o link").setRequired(true).setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices = [];

        if (focusedOption.name === 'música') {
            if (playlist.get(`${interaction.user.id}`)) {
                const allProdutos = playlist.get(`${interaction.user.id}.musics`)

                choices = allProdutos.map(p => ({ name: p.name, url: p.url }));
            }
        }

        if (choices.length === 0) {
           choices = [{ name: "Nenhuma música encontrada nos seus favoritos", url: "s" }]
        }

        const filtered = choices.filter(choice =>
            choice.name.startsWith(focusedOption.value)
        );

        const formattedChoices = filtered.map(choice => {

            if (focusedOption.name === 'música') {

                if (choice.name === "Nenhuma música encontrada nos seus favoritos") {
                    return {
                        name: `❌ | ${choice.name}`,
                        value: choice.url,
                    };
                }
               

                return {
                    name: `🎵 | ${choice.name.slice(0, 99)}`,
                    value: choice.url,
                };
            }
        });


        await interaction.respond(formattedChoices);
    },

    async execute(interaction, client) {
        const track = interaction.options.getString("música")

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
                message: "Eu ja estou tocando em outro canal",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        if (!voiceChannel.viewable) {
            return editReply({
                message: "Eu não tenho permissão para ver este canal de voz",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        if (!voiceChannel.joinable) {
            return editReply({
                message: "Eu não tenho permissão para entrar neste canal de voz",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        if (voiceChannel.full) {
            return editReply({
                message: "Este canal de voz está cheio, não consigo entrar",
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        const searchResult = await player
            .search(track, { requestedBy: interaction.user })
            .catch(() => null);

        if (!searchResult?.hasTracks()) {
            return editReply({
                message: `Nenhum resultado encontrado para **${track}**`,
                interaction: interaction,
                ephemeral: true,
                type: "error"
            })
        }

        await player.play(voiceChannel, searchResult, {
            nodeOptions: {
                metadata: {
                    interaction: interaction,
                    track: searchResult,
                    client: client,
                    voiceChannel: voiceChannel
                },
            },
        });

        const getQueue = player.queues.cache.get(interaction.guild.id)

   
        

        if (searchResult.playlist) {

            const { tracks, title, url } = searchResult.playlist

            return editReply({
                message: `Foram adicionadas **${tracks.length}** músicas da playlist **[${title}](${url})**`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        }

        if (getQueue.tracks.data.length === 0) {

            editReply({
                message: `Tocando agora **${searchResult.tracks[0].title}**`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })

        } else {
            editReply({
                message: `**${searchResult.tracks[0].title}** foi adicionado a fila`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })
        }

    }
}

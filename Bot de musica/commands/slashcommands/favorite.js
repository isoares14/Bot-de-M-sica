const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle } = require('discord.js');
const wio = require("wio.db");
const playlist = new wio.JsonDatabase({ databasePath: "database/playlists.json" })

const config = require('../../config.json')
const { reply, editReply } = require("../../utils/defaultMessages")
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('favorite')
        .setDescription('adicionar ou remover uma música em seus favoritos')
        .addSubcommand(sb => sb.setName("add").setDescription("adicionar a música atual em seus favoritos"))
        .addSubcommand(sb => sb.setName("remove").setDescription("remover música dos seu favoritos")
            .addStringOption(op => op.setName("música").setDescription("escolha uma música").setAutocomplete(true).setRequired(true))
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
                    name: `🎵 | ${choice.name}`,
                    value: choice.url,
                };
            }
        });


        await interaction.respond(formattedChoices);
    },


    async execute(interaction, client) {

        if (interaction.options.getSubcommand() === 'remove') {
            const msc = interaction.options.getString("música")

            if (!playlist.get(`${interaction.user.id}`)) {
                return reply({
                    message: "Essa música não existe em seus favoritos",
                    interaction: interaction,
                    ephemeral: true,
                    type: "error"
                })
            }

     

            const allmsc = playlist.get(`${interaction.user.id}.musics`).filter(music => music.url !== msc)
    

            if (allmsc) {

                playlist.set(`${interaction.user.id}.musics`, allmsc)

                return reply({
                    message: "Música removida com sucesso aos seus favoritos",
                    interaction: interaction,
                    ephemeral: true,
                    type: "success"
                })
            } else {
                console.log("n existe")
            }


        }

        if (interaction.options.getSubcommand() === 'add') {

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


            if (playlist.get(`${interaction.user.id}`)) {
                if (playlist.get(`${interaction.user.id}.musics`).some(msc => msc.name === getQueue.currentTrack.title)) {
                    return editReply({
                        message: `Essa música ja esta nos seus favoritos`,
                        interaction: interaction,
                        ephemeral: true,
                        type: "error"
                    })
                }
            }

            let formateString = String(getQueue.currentTrack.title).slice(0,90)

            playlist.push(`${interaction.user.id}.musics`, { name: formateString, url: getQueue.currentTrack.url })

            editReply({
                message: `**${getQueue.currentTrack.title}** foi adicionado aos seus favoritos`,
                interaction: interaction,
                ephemeral: true,
                type: "success"
            })
        }

    }
}

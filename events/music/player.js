const { useMainPlayer } = require("discord-player")
const { PermissionsBitField, EmbedBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, MessageButton, ModalBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require("../../config")
const wio = require("wio.db")
const painels = new wio.JsonDatabase({ databasePath: "database/painels.json" })
const player = useMainPlayer()

player.events.on("playerStart", (queue, track) => {

    const { interaction, voiceChannel } = queue.metadata

        const buttonsPlyer = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("favorite")
            .setEmoji("❤️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("back")
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji("⏸️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("skip")
            .setEmoji("⏭️")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji("⏹️")
            .setStyle(ButtonStyle.Secondary),
        )

        const embedPlaying = new EmbedBuilder()
            .setColor(config.embedColor)
            .setImage("https://i.ibb.co/3f5wmXV/Infinity-Music-Banner.png")
            .setDescription(`## [${track.title}](${track.url})`)
            .setFooter({ text: `Pedido por: ${queue.currentTrack.requestedBy.username}`, iconURL: queue.currentTrack.requestedBy.avatarURL() })
            .addFields(
                { name: '🎤 Autor', value: track.author, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '⏱️ Duração', value: track.duration, inline: true },
                { name: '🔊 Canal', value: `${voiceChannel}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '📋 Músicas na fila', value: `${queue.tracks.data.length}`, inline: true },
            )
            .setTimestamp();

            if (track.thumbnail) {
                embedPlaying.setThumbnail(track.thumbnail)
            }

        if (track.source === "spotify") {
            embedPlaying.setAuthor({ name: "Spotify", iconURL: "https://i.ibb.co/7VS4j2x/IMG-0741.png" })
        } else if (track.source === "soundcloud") {
            embedPlaying.setAuthor({ name: "SoundCloud", iconURL: "https://i.ibb.co/vjRm3N1/IMG-0743.png" })
        } else if (track.source === "youtube") {
            embedPlaying.setAuthor({ name: "YouTube", iconURL: "https://i.ibb.co/0yX4tqp/IMG-0744.png" })
        }

      

        if (!painels.get(`${interaction.guild.id}`)) {
            interaction.channel.send({ embeds: [embedPlaying], components: [buttonsPlyer] }).then(async msg => {
                painels.set(`${interaction.guild.id}.message_id`, msg.id)
                painels.set(`${interaction.guild.id}.channel_id`, msg.channel.id)
            })
        } else {
            const msg_id = painels.get(`${interaction.guild.id}.message_id`)
            const canal = interaction.guild.channels.cache.get(painels.get(`${interaction.guild.id}.channel_id`));

            canal.messages.fetch(msg_id)
                .then(async m => {
                m.edit({ embeds: [embedPlaying], components: [buttonsPlyer]})
                })
        }

});

player.events.on("audioTrackAdd", (queue, track) => {
    const { interaction, voiceChannel } = queue.metadata

    if (painels.get(`${interaction.guild.id}`)) {
        const msg_id = painels.get(`${interaction.guild.id}.message_id`)
        const canal = interaction.guild.channels.cache.get(painels.get(`${interaction.guild.id}.channel_id`));
        const curretTrack = queue.currentTrack


       if (!curretTrack) return

        canal.messages.fetch(msg_id)
            .then(async m => {

                const embedPlaying = new EmbedBuilder()
                .setColor(config.embedColor)
                .setImage("https://i.ibb.co/3f5wmXV/Infinity-Music-Banner.png")
                .setDescription(`## [${curretTrack.title}](${curretTrack.url})`)
                .setFooter({ text: `Pedido por: ${curretTrack.requestedBy.username}`, iconURL: interaction.user.avatarURL() })
                .addFields(
                    { name: '🎤 Autor', value: curretTrack.author, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: '⏱️ Duração', value: curretTrack.duration, inline: true },
                    { name: '🔊 Canal', value: `${voiceChannel}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: '📋 Músicas na fila', value: `${queue.tracks.data.length}`, inline: true },
                )
                .setTimestamp();

                if (curretTrack.thumbnail) {
                    embedPlaying.setThumbnail(curretTrack.thumbnail)
                }

                if (curretTrack.source === "spotify") {
                    embedPlaying.setAuthor({ name: "Spotify", iconURL: "https://i.ibb.co/7VS4j2x/IMG-0741.png" })
                } else if (curretTrack.source === "soundcloud") {
                    embedPlaying.setAuthor({ name: "SoundCloud", iconURL: "https://i.ibb.co/vjRm3N1/IMG-0743.png" })
                } else if (curretTrack.source === "youtube") {
                    embedPlaying.setAuthor({ name: "YouTube", iconURL: "https://i.ibb.co/0yX4tqp/IMG-0744.png" })
                }

            m.edit({ embeds: [embedPlaying]}).catch(err => {
                return
            })
            })
    }
})


player.events.on("queueDelete", (queue, track) => {
    const { interaction } = queue.metadata

    const embedDesconenct = new EmbedBuilder()
        .setTitle("Desconectado")
        .setColor("Red")
        .setImage("https://i.ibb.co/3f5wmXV/Infinity-Music-Banner.png")
        .setDescription(`Não há mais músicas para tocar.`)
        .setTimestamp();

    const msg_id = painels.get(`${interaction.guild.id}.message_id`)
    const canal = interaction.guild.channels.cache.get(painels.get(`${interaction.guild.id}.channel_id`));

    canal.messages.fetch(msg_id)
        .then(async m => {
        m.edit({ embeds: [embedDesconenct], components: []})
        painels.delete(`${interaction.guild.id}`)
        }).catch(err => {
            painels.delete(`${interaction.guild.id}`)
        })

})




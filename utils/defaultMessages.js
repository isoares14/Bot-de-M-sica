const { EmbedBuilder } = require('discord.js');

async function reply(data) {

    const { interaction, message, ephemeral, type } = data;

    switch(type) {

        case "error": {
            const embedError = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ ${message}`)

           return interaction.reply({ embeds: [embedError], ephemeral: ephemeral })
        }

        case "success": {
            const embedSuccess = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ ${message}`)

           return interaction.reply({ embeds: [embedSuccess], ephemeral: ephemeral })
        }
    }
}

async function editReply(data) {

    const { interaction, message, ephemeral, type } = data;

    switch(type) {

        case "error": {
            const embedError = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ ${message}`)

           return interaction.editReply({ embeds: [embedError], ephemeral: ephemeral })
        }

        case "success": {
            const embedSuccess = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ ${message}`)

           return interaction.editReply({ embeds: [embedSuccess], ephemeral: ephemeral })
        }
    }
}

async function followUp(data) {

    const { interaction, message, ephemeral, type } = data;

    switch(type) {

        case "error": {
            const embedError = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ ${message}`)

           return interaction.followUp({ embeds: [embedError], ephemeral: ephemeral })
        }

        case "success": {
            const embedSuccess = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ ${message}`)

           return interaction.followUp({ embeds: [embedSuccess], ephemeral: ephemeral })
        }
    }
}

module.exports = { reply, editReply, followUp }

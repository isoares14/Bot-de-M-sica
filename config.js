require("dotenv").config({ quiet: true })

const requiredVariables = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID"]
const missingVariables = requiredVariables.filter(name => !process.env[name])

if (missingVariables.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missingVariables.join(", ")}`)
}

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    embedColor: process.env.BOT_EMBED_COLOR || "#5865F2"
}

const fs = require("node:fs")
const path = require("node:path")
const { Client, Collection, GatewayIntentBits } = require("discord.js")
const { Player } = require("discord-player")
const config = require("./config")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
})

const player = new Player(client)

client.commands = new Collection()

async function start() {
    const functionsPath = path.join(__dirname, "functions")
    const eventsPath = path.join(__dirname, "events")
    const commandsPath = path.join(__dirname, "commands")
    const functions = fs.readdirSync(functionsPath).filter(file => file.endsWith(".js"))
    const events = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))
    const commandFolders = fs.readdirSync(commandsPath)

    for (const file of functions) {
        require(path.join(functionsPath, file))(client)
    }

    await player.extractors.loadDefault()
    await client.handleEvents(events, eventsPath)
    await client.handleCommands(commandFolders, commandsPath)
    await client.login(config.token)
}

start().catch(error => {
    console.error("Não foi possível iniciar o bot:", error)
    process.exitCode = 1
})

process.on("unhandledRejection", error => {
    console.error("Falha assíncrona não tratada:", error)
})

process.on("uncaughtException", error => {
    console.error("Erro não tratado:", error)
    process.exitCode = 1
})

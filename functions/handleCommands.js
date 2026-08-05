const fs = require("node:fs")
const path = require("node:path")
const { REST, Routes } = require("discord.js")
const config = require("../config")

module.exports = client => {
    client.handleCommands = async (commandFolders, commandsPath) => {
        const commandData = []

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder)
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"))

            for (const file of commandFiles) {
                const command = require(path.join(folderPath, file))
                client.commands.set(command.data.name, command)
                commandData.push(command.data.toJSON())
            }
        }

        const rest = new REST({ version: "10" }).setToken(config.token)
        await rest.put(Routes.applicationCommands(config.clientId), { body: commandData })
        console.log(`${commandData.length} comandos registrados com sucesso.`)
    }
}

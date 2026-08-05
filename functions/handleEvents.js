const path = require("node:path")

module.exports = client => {
    client.handleEvents = async (eventFiles, eventsPath) => {
        require(path.join(eventsPath, "music", "player.js"))

        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file))
            const listener = (...args) => event.execute(...args, client)

            if (event.once) {
                client.once(event.name, listener)
            } else {
                client.on(event.name, listener)
            }
        }
    }
}

const Discord = require("discord.js")

module.exports = {
    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    run : async (interaction) => {
        console.log("Hey !");
        interaction.reply("Yo !");
    },

    help: {
        name: "ping",
        description: "Une cmds de test"
    }
}
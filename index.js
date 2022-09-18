const { Client, GatewayIntentBits, IntentsBitField, Partials } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] , partials: [Partials.Message, Partials.Channel, Partials.Reaction]});

function print(msg){
    let date = new Date();
    console.log(`[HX1Bot Logs ${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}]: ${msg}`);
}


client.on("ready", async () =>  {
    print("Bot ready !");
})

client.on('messageCreate', async (msg) => {
    if(msg.author.bot){
        return;
    }
    print(msg);
    if(msg.content.toLowerCase().includes("du coup")){
        msg.reply("Non pas du coup !");
    }
});

client.login("MTAyMTA2MzUxODIwNTc4ODIzMg.G3411M.T8hIXrIzrz1urJLfOtbXTdsziAnTMmRgrqxA-I");
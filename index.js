const { Client, GatewayIntentBits, IntentsBitField, Partials, REST, Routes } = require('discord.js');
const fs = require('fs');
const token = require("./token.json")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] , partials: [Partials.Message, Partials.Channel, Partials.Reaction]});


let commands = [];

let buttons = [];

let slashCmds = [];
(async ()=>{
    //Read slash cmds in ./slashcmds
    let filesArray = []
    fs.readdir("./slashcmds", async (err, files)=>{
        if(err){
            console.log(err);
            return;
        }
        files = files.slice(',');
        for(let i = 0; i<files.length;i++){
            let cmd = require("./slashcmds/"+files[i])
            slashCmds.push(cmd)
            commands.push(cmd.help)

            if(cmd.buttons != undefined){
                buttons.push(cmd.buttons)
            }

            console.log(buttons)
        }
    })
})();

const rest = new REST({ version: '10' }).setToken("MTAyMTA2MzUxODIwNTc4ODIzMg.G3411M.T8hIXrIzrz1urJLfOtbXTdsziAnTMmRgrqxA-I");


function print(msg){
    let date = new Date();
    console.log(`[HX1Bot Logs ${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}]: ${msg}`);
}


client.on("ready", async () =>  {
    print("Bot ready !");

    (async () => {
        try {
          console.log('Started refreshing application (/) commands.');
      
          await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      
          console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
          console.error(error);
        }
      })();
})

client.on('messageCreate', async (msg) => {
    if(msg.author.bot){
        return;
    }
    //print(msg);
    let msgL = msg.content.toLowerCase();
    if(msgL.includes("ducoup") | msgL.includes("du coup") | msgL.includes("dcp")){
        msg.reply("Non pas du coup !");
    }

    if(msgL.includes("ratio")){
        msg.react('🥶');
    }

});


/**
 * 
 * @param {import('discord.js').Interaction} interaction 
 * @returns {void}
 */
function LaunchIfInclude(interaction){
    for(let i = 0 ; i<slashCmds.length; i++){
        if(slashCmds[i].help.name === interaction.commandName){
            slashCmds[i].run(interaction);
            return;
        }
    }

    for (let i = 0; i<buttons.length; i++){
        for(let j=0; j<buttons[i].length; j++){
            if (buttons[i][j].name === interaction.customId.split('-')[0]){
                buttons[i][j].fun(interaction);
                return;
            }
        }
    }
}
client.on("interactionCreate", async (interaction) => {
    //if (!interaction.isChatInputCommand()) return;

    
    LaunchIfInclude(interaction)
});

client.login(token.token);
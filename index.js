const { Client, GatewayIntentBits, IntentsBitField, Partials, REST, Routes, GuildMember, Guild , EmbedBuilder} = require('discord.js');
const fs = require('fs');
const token = require("./token.json")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] , partials: [Partials.Message, Partials.Channel, Partials.Reaction]});

const HX1_SERVER_ID = "1014851079160209488" ;
const HX1_BDAY_CHAN_ID = "1014859781971902525";
const HX1_Z51 = "1023884212060815360";


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

            //console.log(buttons)
        }
    })
})();

const rest = new REST({ version: '10' }).setToken(token.token);


function print(msg){
    let date = new Date();
    console.log(`[HX1Bot Logs ${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}]: ${msg}`);
}

/*
fs.readFile("data/bday_list.txt", async(err,data) =>{
    let txt = data.toString();
    let list = txt.split('\r\n')
    let sub = list.join(":").toString().split(":")


    let f = []

    for(let i = 0; i<sub.length;i+=3){
        let s = [sub[i], sub[i+1], sub[i+2]];
        let dateT = Date.parse(s[0])
        let date = new Date(dateT)
        if(date.getMonth() > 9){
            date = Date.parse(s[0] + " 2022")
        }else{
            date = Date.parse(s[0] + " 2023")
        }
        date+=8*3600*1000
        let o = {"id": s[2].toString().replace(" ", ''), "date": date, "announced": false};
        f.push(o)
    }
    //console.log(JSON.stringify(f))
});
*/

const birthday = (async() => {
    fs.readFile("data/bday.json", async(err,data)=>{
        if(err){
            console.error(err);
            return;
        }
        let bdayData = JSON.parse(data);
        const guild = await client.guilds.fetch(HX1_SERVER_ID);
        const members = await guild.members.fetch();   //map of guildMember by id
        const length = bdayData["HX1"].length; 
        for(let i = 0; i < length; i++){

            if( bdayData["HX1"][i]["id"] == 0 ){
                continue;
            }

            const mem = members.get(bdayData["HX1"][i]["id"]);
            if(mem != undefined && !bdayData["HX1"][i]["announced"] && bdayData["HX1"][i]["date"] <= Date.now()){ //funny stuff
                client.channels.fetch(HX1_BDAY_CHAN_ID).then(async (chan) => {
                    //TODO funny embed
                    let embed = new EmbedBuilder().setColor("6294cd").setTitle("Anniversaire 🎂 !").setDescription(`Bon anniversaire  <@${mem.user.id}> ! Passe une bonne journée`)
                    bdayData["HX1"][i]["announced"] = true;
                    chan.send({embeds: [embed]});
                    fs.writeFileSync("data/bday.json", JSON.stringify(bdayData), 'utf8');
                })
            }
        }
        setTimeout(() => {
            birthday();
        }, 10000);
         
    })

})



client.on("ready", async () =>  {
    print("Bot ready !");

    birthday();

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

    if(msgL.includes(" ratio ")){
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
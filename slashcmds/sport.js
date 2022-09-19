const { ButtonStyle } = require("discord.js");
const Discord = require("discord.js")
const fs = require("fs")

    /**
    * 
    * @param {import("discord.js").Interaction} interaction 
    */



async function add(interaction){
    fs.readFile("json/sport.json", (err, data)=> {
    console.log("USER ID:")
    console.log(interaction.user.id)
    let sport = JSON.parse(data)
    console.log(sport)
    interaction.reply("OK")
    sport[interaction.user.id] += 1;
    let nbOfSport = sport[interaction.user.id]

    fs.writeFile("json/sport.json", JSON.stringify(sport), 'utf8', ()=>{
        interaction.update({content: `Nombre de séances: ${nbOfSport}`});
    });
})
    
}

/**
* 
* @param {import("discord.js").Interaction} interaction 
*/
async function remove(interaction){
    fs.readFile("json/sport.json", (err, data)=> {
        let sport = JSON.parse(data)
        if(sport[interaction.user.id]<=0){
            interaction.reply("Erreur (0 séances de sport...)")
            return;
        }
        sport[interaction.user.id] -= 1;
        let nbOfSport = sport[interaction.user.id]
        fs.writeFile("json/sport.json", JSON.stringify(sport), 'utf8', ()=>{
            interaction.update({content: `Nombre de séances: ${nbOfSport}`});
        });
    })
}



module.exports = {   
    
    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    run : async (interaction) => {

        fs.readFile("json/sport.json", (err, data)=>{

        let sport = JSON.parse(data);
        
        const clientID = interaction.user.id;
        
        let nbSeances;
        let add = ""
        if (sport[clientID] === undefined){
            console.log("connais pas !")
            nbSeances = 0
            add = "Bienvenue ! ";
            sport[clientID] = 0;

            console.log(sport);           
            fs.writeFile("json/sport.json", JSON.stringify(sport), 'utf8', ()=>{console.log(`Ecris`)});

        }else{
            nbSeances = sport[clientID];
        }


        const row = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder().setCustomId("sport_add-"+clientID.toString())
                                .setLabel("Ajouter une séance").setStyle(ButtonStyle.Success),
                                new Discord.ButtonBuilder().setCustomId("sport_remove-"+clientID.toString())
                                .setLabel("Retirer une séance").setStyle(ButtonStyle.Danger))

        interaction.reply({content: `${add}Nombre de séances: ${nbSeances}`, components : [row], ephemeral: true});
        });
    },

    help: {
        name: "sport",
        description: "S'organiser en EPS"
    }, 
    
    buttons:  [{name: "sport_add", fun: add}, {name: "sport_remove", fun: remove} ]
}
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
var isReady = true;

client.once('ready', () => {
    console.log('Ready!');
    client.user.setPresence({ activity: { name: "H&R Bot suck my dick", type: "WATCHING" }, status: "online" })
});

client.on('message', async message => {

    //Shutting up the dad bot
    if (message.author.username === 'Dad Bot') {
        message.delete();
        message.channel.send(`Fuck off Margo I deleted your message`);
    }

    //Thirsty emoji auto-send
    if (message.content.includes("thirsty") || message.content.includes('Thirsty')) {
        message.channel.send('<:Thirst:689204786083659776>');
    }

    //Don't respond to any other bot messages
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    var voiceInfo = {
        "coffin": 0.25,
        "psy": 0.5,
        "sparta": 1.2,
        "nice": 1.25,
        "mmm": 0.5,
        "homie": 1.0,
        "shia": 0.75
    }

    //Help command
    if (command === 'help' || command === 'info') {

        var textCommands = ["=noice: Sends a noice message\n"];
        textCommands.push("=server: Sends server information\n");
        textCommands.push("=ansh: Insults Justin\n");
        textCommands.push("=megamoto: Sends all the moto moto emojis\n");
        textCommands.push("=headout: Sends the ight imma head out gif\n");
        textCommands.push("=insult @user: Insults the selected user\n");
        textCommands.push("=botclean/buttclean: Cleans all bot messages and commands from channel\n");
        textCommands.push("=prune {n}: Deletes the last n messages from the channel\n");

        var voiceCommands = [];
        voiceCommands.push("=coffin: plays coffin dance\n");
        voiceCommands.push("=psy: Plays a gangnam style soundbyte\n");
        voiceCommands.push("=sparta: This is Sparta!\n");
        voiceCommands.push("=nice: *click* Nice\n");
        voiceCommands.push("=mmm: mmm whatcha say\n");
        voiceCommands.push("=homie: I GOTCHU HOMIE\n");
        voiceCommands.push("=shia: JUST DO IT\n");


        var textCommandString = textCommands.join('');
        var voiceCommandString = voiceCommands.join('')

        //Create embed help explanation and send it
        message.channel.send({
            embed: {
                color: 0x999999,
                title: "Turbohacks Help",
                url: "https://www.github.com/Gamebot3/Turbohacks",
                fields: [{
                    name: "Text Commands",
                    value: textCommandString
                }, {
                    name: "Voice Commands",
                    value: voiceCommandString
                }],
            }
        });
    }


    // Start of all the normal commands
    if (command === 'noice') {
        message.channel.send('FUCKING NOICE');
        message.channel.send('<:Bratt:688138276422680666>');
    }
    if (command === `server`) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal Members: ${message.guild.memberCount}`);
    }
    if (command === `ansh`) {
        message.channel.send('Justin is a dumbass.');
    }
    if (command === `headout`) {
        const attachment = new Discord.MessageAttachment('https://anshjainpublic.s3.us-east-2.amazonaws.com/headout.gif');
        await message.channel.send(attachment).then(headout => {
            message.delete({ timeout: 5000 }).catch()
            headout.delete({ timeout: 5000 }).catch()
        })

    }
    if (command === 'megamoto') {
        message.channel.send('<:big:689542236878274608> <:chunky:689542818410266726> <:spunky:689543031967186944>')
    }

    //Voice play commands
    if (Object.keys(voiceInfo).includes(command)) {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send('You need to be in a voice channel to use this command!');
            return;
        }
        voiceChannel.join().then(connection => {
                var playString = './sounds/' + command + '.mp3';
                const dispatcher = connection.play(playString, { volume: voiceInfo[command] });
                dispatcher.on("finish", () => {
                    voiceChannel.leave();
                });
            })
            .catch(console.error);
    }

    //botclean/buttclean command: deletes all bot messages from the channel
    if (command == 'botclean' || command == 'buttclean') {
        message.channel.messages.fetch()
            .then(messages => {
                const filteredMessages = messages.filter(m => m.author.bot || m.content.startsWith("!") || m.content.startsWith(`${prefix}`) || m.content.startsWith("-") || m.content.startsWith('p!') || m.content.startsWith('+')).array();
                message.channel.bulkDelete(filteredMessages);
                message.channel.send("Deleted " + filteredMessages.length + " bot messages and commands.");
            })
            .catch(console.error);
    }


    //Insult command: insults the mentioned user
    if (command === 'insult') {

        if (!message.mentions.users.size) {
            return message.channel.send('Insult whom?');
        }
        var insults = ["You're slow."];
        insults.push("I do not consider you a vulture, but something a vulture would eat.");
        insults.push("People clap when they see you. They clap their hands over their eyes.");
        insults.push("You are proof that God has a sense of humor.");
        insults.push("If I throw you a stick, will you leave?");
        insults.push("In the land of the witless, you would be king.")
        insults.push("You egg.");
        insults.push("You sir, are the reason God created the middle finger.");
        insults.push("Lick my balls.");
        insults.push("Sometimes I need what only you can provide. Your absence.");
        insults.push("It is impossible to underestimate you.");
        insults.push("I'm jealous of all the people who haven't met you.");
        insults.push("You are more disappointing than an unsalted pretzel.");
        insults.push("You're so ugly, you make your happy meal cry.");
        insults.push("I'll never forget the first time we met. But I'll keep trying.");
        insults.push("You must've been born on the highway cause that's where accidents happen.");
        insults.push("You bring everyone so much joy when you leave the room.");
        insults.push("I love to shop but I won't buy your bullshit.");
        insults.push("I never forget a face, but I'll make an exception for you.");
        insults.push("Your mom is so fat she clogged a black hole.");

        const taggedUser = message.mentions.users.first();

        message.channel.send(`<@${taggedUser.id}>` + ` ` + insults[Math.floor(Math.random() * insults.length)]);
    }

    //Prune command (deletes the last n messages from the channel)
    if (command === 'prune') {
        var amount = parseInt(args[0]);
        if (isNaN(amount)) {
            return message.reply('That isn\'t a valid number moron.');
        } else if (amount < 2 || amount > 100) {
            return message.reply('Make sure the number you enter is between 2 and 100.');
        }
        message.channel.bulkDelete(amount + 1);
    }
});

client.login(token);
const fs = require('fs');
const Discord = require ('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
const plugins = fs.readdirSync('./commands/plugins');
const cooldowns = new Discord.Collection();

// Set commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

if (plugins.length) {
	for (const directory of plugins) {
		var commands =  fs.readdirSync(`./commands/plugins/${directory}`).filter
			(file => file.endsWith('.js'));
		if (commands.length) {
			for (const file of commands) {
				const command =
					require(`./commands/plugins/${directory}/${file}`);
				client.commands.set(command.name, command);
			}
		}
	}
}

// Turn up bot
client.once('ready', () => {
	console.log('Ready!');
});

// When soameone messages
client.on('message', message => {
	// Check to see if someone is contacing the bot
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	// Splits inputs into sepreate strings
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	
	const commandName = args.shift().toLowerCase(); // Remove case sensitivity
	
	// Compare argument to list of commands/aliases
	const command = client.commands.get(commandName) || client.commands.find
		(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return; // Exit if not a command
	
	// Check to see if command can be used in DMs
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	
	// Ensures that required arguments were provided
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: ` +
				`\`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	
	// Checks if command has a cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now(); // Current time
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	// Gives cooldown message if command requested too soon
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id)
			+ cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more ` +
				`second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	
	// Clears cooldown check
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	// Tries to execute command
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Login to Discord
client.login(token);
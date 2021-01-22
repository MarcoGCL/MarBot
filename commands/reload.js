module.exports = {
	name: 'reload',
	aliases: null,
	description: 'Reloads a command',
	guildOnly: false,
	cooldown: 3,
	path: './',
	args: true,
	usage: '<command>',
	execute(message, args) {
		// Gets the inputted commands
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find
			(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		
		// Checks if inputted command exists
		if (!command) return message.channel.send(`There is no command with ` +
			`name or alias \`${commandName}\`, ${message.author}!`);
		
		// Remove command from cache
		delete require.cache[require.resolve(`${command.path}${command.name}.js`)];
		
		// Try to reload the command
		try {
			const newCommand = require(`${command.path}${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded!`);
		} catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a ` + 
				`command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};
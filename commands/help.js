module.exports = {
	name: 'help',
	aliases: null,
	description: 'List all commands. Use \`!help <command>`\ ' +
		'for a description of a specific command.',
	guildOnly: false,
	cooldown: 1,
	path: './',
	args: false,
	usage: null,
	execute(message, args) {
		// Gets list of commands
		var fs = require('fs');
		var commands = fs.readdirSync('./commands').filter
			(file => file.endsWith('.js'));
			
		// Gets list of plugin directories
		var plugins = fs.readdirSync('./commands/plugins');
		
		var output = '';
		
		// Checks if the input exists
		if (!Array.isArray(args) || !args.length) {
			// Add commands to the output. Removes .js
			output = '**Commands:** ';
			for (const command of commands) {
				output = output + `\`${command.slice(0, -3)}\`, `;
			}
			// Removes extra comma from last input
			output = output.slice(0, -2);
			
			// Add plugin commands to output
			if (plugins.length) {
				for (const directory of plugins) {
					var pCommands = 
						fs.readdirSync(`./commands/plugins/${directory}`).filter
						(file => file.endsWith('.js'));
					if (pCommands.length) {
						output = `${output}\n**${directory}:** `;
						for (const command of pCommands) {
							output = output + `\`${command.slice(0, -3)}\`, `;
						}
						output = output.slice(0, -2);
					}
				}
			}
		} else {
			// Gets the inputted commands
			const commandName = args[0].toLowerCase();
			const command = message.client.commands.get(commandName)
				|| message.client.commands.find
				(cmd => cmd.aliases && cmd.aliases.includes(commandName));
			
			// Checks if inputted command exists
			if (command) {
					output = command.description;
			} else {
				for (const arg of args) {
					output = output + arg + " ";
				}
				output = output + 'is not a command. Use \`!help\` to ' +
					'see a list of available commands.';
			}
		}
		
		message.channel.send(output);
	},
};
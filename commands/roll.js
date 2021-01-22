module.exports = {
	name: 'roll',
	aliases: null,
	description: 'Roll a dice of \'x\' sides. Defaults '
		+ 'to size 6. Can not have less than 1 side.',
	guildOnly: false,
	cooldown: 3,
	path: './',
	args: false,
	usage: '<number>',
	execute(message, args) {
		var sides = 6; // Default is a 6-sided die (d6)
		
		// If argument is a number and is greater than 0
		if (!isNaN(args[0])) {
			if (args[0] > 0) {
				sides = args[0]; // change die to an x-sided die
			}
		}
		
		message.channel.send(`${message.author} rolled a `
			+ (Math.floor(Math.random() * sides) + 1));
	},
};
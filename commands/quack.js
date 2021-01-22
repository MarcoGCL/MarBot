module.exports = {
	name: 'quack',
	aliases: null,
	description: 'QUACK!',
	guildOnly: false,
	cooldown: 0,
	path: './',
	args: false,
	usage: null,
	execute(message, args) {
		message.channel.send('QUACK!');
	},
};
module.exports = {
	name: 'ping',
	aliases: null,
	description: 'Ping!',
	guildOnly: false,
	cooldown: 3,
	path: './',
	args: false,
	usage: null,
	execute(message, args) {
		message.channel.send('Pong!');
	},
};
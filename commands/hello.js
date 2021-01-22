module.exports = {
	name: 'hello',
	aliases: ['hi', 'yo', 'yello', 'sup', 'wassup'],
	description: 'Says hi.',
	guildOnly: false,
	cooldown: 3,
	path: './',
	args: false,
	usage: null,
	execute(message, args) {
		message.reply('hello~ QUACK!');
	},
};
module.exports = {
	name: "prefix",
	params: [],
	description: "Change the prefix for the bot.",
	code: (async function prefix (context, target) {
		const guildData = await app.Cache.getByPrefix(`discord-guilds-${context.channel.guild.id}`);
		const { prefix } = guildData;

		if (!target) {
			return {
				success: true,
				reply: `The current prefix is \`${prefix}\`.`
			};
		}

		if (target.length > 2) {
			return {
				success: false,
				reply: "The prefix must be 2 characters or less."
			};
		}

		guildData.prefix = target;
		await app.Cache.setByPrefix(`discord-guilds-${context.channel.guild.id}`, guildData, { expiry: 0 });

		return {
			success: true,
			reply: `The prefix has been changed to \`${target}\`.`
		};
	}),
	usage: [
		{
			color: 0x00FF00,
			title: "Prefix",
			description: "Change the prefix for the bot."
			+ "\n\n**Usage:**"
			+ "\n`prefix <prefix>`",
			timestamp: new Date(),
			footer: {
				text: "The prefix must be 2 characters or less."
			}
		}
	]
};

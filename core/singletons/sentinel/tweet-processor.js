const parseTweet = async (tweet) => {
	const tweetData = {
		type: "tweet"
	};

	const tweetObject = tweet.legacy ?? tweet;
	const { id_str: id, full_text: text, created_at: createdAt } = tweetObject;

	tweetData.id = id;
	tweetData.userId = tweetObject.user.id_str;
	tweetData.text = text;
	tweetData.createdAt = createdAt;

	const { extended_entities: extendedEntities } = tweetObject;
	if (extendedEntities) {
		const { media } = extendedEntities;
		if (media) {
			const mediaData = media.map((mediaItem) => {
				const { type, media_url_https: url } = mediaItem;
				return {
					type,
					url
				};
			});

			tweetData.media = mediaData;
		}
	}

	return tweetData;
};

module.exports = parseTweet;
module.exports = class User {
	#user;
	#bearer;
	#guestToken;
	#cookies;

	static gqlFeatures = {
		android_graphql_skip_api_media_color_palette: false,
		blue_business_profile_image_shape_enabled: false,
		creator_subscriptions_subscription_count_enabled: false,
		creator_subscriptions_tweet_preview_api_enabled: true,
		freedom_of_speech_not_reach_fetch_enabled: false,
		graphql_is_translatable_rweb_tweet_is_translatable_enabled: false,
		hidden_profile_likes_enabled: false,
		highlights_tweets_tab_ui_enabled: false,
		interactive_text_enabled: false,
		longform_notetweets_consumption_enabled: true,
		longform_notetweets_inline_media_enabled: false,
		longform_notetweets_richtext_consumption_enabled: true,
		longform_notetweets_rich_text_read_enabled: false,
		responsive_web_edit_tweet_api_enabled: false,
		responsive_web_enhance_cards_enabled: false,
		responsive_web_graphql_exclude_directive_enabled: true,
		responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
		responsive_web_graphql_timeline_navigation_enabled: false,
		responsive_web_media_download_video_enabled: false,
		responsive_web_text_conversations_enabled: false,
		responsive_web_twitter_article_tweet_consumption_enabled: false,
		responsive_web_twitter_blue_verified_badge_is_enabled: true,
		rweb_lists_timeline_redesign_enabled: true,
		spaces_2022_h2_clipping: true,
		spaces_2022_h2_spaces_communities: true,
		standardized_nudges_misinfo: false,
		subscriptions_verification_info_enabled: true,
		subscriptions_verification_info_reason_enabled: true,
		subscriptions_verification_info_verified_since_enabled: true,
		super_follow_badge_privacy_enabled: false,
		super_follow_exclusive_tweet_notifications_enabled: false,
		super_follow_tweet_api_enabled: false,
		super_follow_user_api_enabled: false,
		tweet_awards_web_tipping_enabled: false,
		tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
		tweetypie_unmention_optimization_enabled: false,
		unified_cards_ad_metadata_container_dynamic_card_content_query_enabled: false,
		verified_phone_label_enabled: false,
		vibe_api_enabled: false,
		view_counts_everywhere_api_enabled: false
	};

	constructor (user, config) {
		this.#user = user;
		if (!this.#user) {
			throw new app.Error({ message: "User is required to fetch data" });
		}

		this.#guestToken = config.guestToken;
		if (!this.#guestToken) {
			throw new app.Error({ message: "Guest token is required to get user data" });
		}

		this.#bearer = config.bearerToken;
		if (!this.#bearer) {
			throw new app.Error({ message: "Bearer token is required to get user data" });
		}

		this.#cookies = config.cookies;
		if (!this.#cookies) {
			throw new app.Error({ message: "Cookies are required to get user data" });
		}
	}

	async getUserData () {
		const variables = encodeURIComponent(JSON.stringify({ screen_name: this.#user }));
		const features = encodeURIComponent(JSON.stringify(User.gqlFeatures));

		const res = await app.Got({
			url: `https://api.twitter.com/graphql/u7wQyGi6oExe8_TRWGMq4Q/UserResultByScreenNameQuery?variables=${variables}&features=${features}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${this.#bearer}`,
				"X-Guest-Token": this.#guestToken,
				"X-Twitter-Active-User": "yes",
				Referer: `https://twitter.com/`,
				Cookie: Object.entries(this.#cookies)
					.map(i => i.join("="))
					.join("; ")
			}
		});

		if (res.statusCode !== 200) {
			return { success: false };
		}

		await app.Sentinel.updateRateLimit();
		if (app.Sentinel.locked) {
			return {
				success: false,
				error: {
					code: "RATE_LIMITED"
				}
			};
		}

		const data = res?.body?.data?.user_result?.result;
		if (!data) {
			return {
				success: false,
				error: {
					code: "NO_USER_FOUND"
				}
			};
		}

		if (data?.unavailable_reason) {
			return {
				success: false,
				error: {
					code: "USER_UNAVAILABLE",
					message: data.unavailable_reason
				}
			};
		}

		return {
			success: true,
			data: {
				id: String(data.rest_id),
				name: data.legacy.name,
				username: data.legacy.screen_name,
				avatar: data.legacy.profile_image_url_https,
				private: data.legacy.protected
			}
		};
	}
};

export default {
	id: 'timio23-operation-comment',
	handler: async ({ collection, comment_key, comment }, { services, database, accountability, getSchema }) => {
		
		const { ActivityService } = services;
		const schema = await getSchema({ database });

		const activityService = new ActivityService({
			schema: schema,
			accountability: accountability,
			knex: database,
		});

		if(!Array.isArray(comment_key) && comment_key.includes("[") === false){
			comment_key = [comment_key];
		}
		const keys = (Array.isArray(comment_key))?comment_key:JSON.parse(Array.isArray(comment_key));
		
		console.log(`Converted ${keys}`);

		let results = [];
		let activity = null;

		for await (const key of keys) {
			try {
				activity = await activityService.createOne({
					action: 'comment',
					comment: comment,
					user: accountability?.user ?? null,
					collection: collection,
					ip: accountability?.ip ?? null,
					user_agent: accountability?.userAgent ?? null,
					origin: accountability?.origin ?? null,
					item: key,
				});

				results.push(activity);
			} catch (error) {
				console.log(error);
				return error;
			}
		};
		
		return results;
	},
};

export default {
	id: 'timio23-operation-comment',
	handler: async ({ collection, comment_key, comment }, { services, database, accountability, getSchema }) => {
		
		const { CommentsService } = services;
		const schema = await getSchema({ database });

		const commentService = new CommentsService({
			schema: schema,
			accountability: accountability,
		});

		if(!Array.isArray(comment_key) && comment_key.includes("[") === false){
			comment_key = [comment_key];
		}
		const keys = (Array.isArray(comment_key))?comment_key:JSON.parse(Array.isArray(comment_key));
		
		console.log(`Converted ${keys}`);

		let results = [];
		let response = null;

		for await (const key of keys) {
			try {
				response = await commentService.createOne({
					comment: comment,
					collection: collection,
					item: key,
				});

				results.push(response);
			} catch (error) {
				console.log(error);
				return error;
			}
		};
		
		return results;
	},
};

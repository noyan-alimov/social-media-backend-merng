const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findById(postId);
				if (!post) {
					throw new Error('Post not found');
				}

				return post;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async createPost(_, { body }, context) {
			const user = checkAuth(context);

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			return post;
		},
		async deletePost(_, { postId }, context) {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (post.username === user.username) {
					await post.deleteOne();
					return 'Post deleted successfully';
				} else {
					throw new AuthenticationError('Action not allowed');
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};

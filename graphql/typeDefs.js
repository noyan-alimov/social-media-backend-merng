const gql = require('graphql-tag');

module.exports = gql`
	type Query {
		getPosts: [Post]
	}
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
`;

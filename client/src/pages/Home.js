import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { Grid } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

function Home() {
	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3} divided>
			<Grid.Row>
				<h1>Recent posts</h1>
			</Grid.Row>
			<Grid.Row>
				{loading ? (
					<h1>Loading posts...</h1>
				) : (
					data.getPosts &&
					data.getPosts.map(post => (
						<Grid.Column key={post.id} style={{ marginBottom: '1.2rem' }}>
							<PostCard post={post} />
						</Grid.Column>
					))
				)}
			</Grid.Row>
		</Grid>
	);
}

const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			createdAt
			username
			likeCount
			commentCount
			likes {
				username
			}
			comments {
				id
				username
				body
				createdAt
			}
		}
	}
`;

export default Home;

import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';

import { Grid } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
	const {
		state: { user },
	} = useContext(AuthContext);

	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	return (
		<Grid columns={3}>
			<Grid.Row className='homepage-title-container'>
				<h1>Recent posts</h1>
			</Grid.Row>
			<Grid.Row>
				{user && (
					<Grid.Column>
						<PostForm />
					</Grid.Column>
				)}
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

export default Home;

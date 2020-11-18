import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, deletePostCallback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const [deletePost] = useMutation(DELETE_POST_MUTATION, {
		update(proxy) {
			setConfirmOpen(false);
			if (deletePostCallback) {
				deletePostCallback();
			}

			// Remove post from cache
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			let newData = [...data.getPosts];
			newData = newData.filter(post => post.id !== postId);
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: {
					...data,
					getPosts: {
						newData,
					},
				},
			});
		},
		variables: { postId },
	});

	return (
		<React.Fragment>
			<Button as='div' color='red' onClick={() => setConfirmOpen(true)}>
				<Icon name='trash' style={{ margin: 0 }} />
			</Button>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePost}
			/>
		</React.Fragment>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

export default DeleteButton;

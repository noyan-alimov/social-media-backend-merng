import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, deletePostCallback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);

			if (!commentId) {
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
			}

			if (deletePostCallback) {
				deletePostCallback();
			}
		},
		variables: { postId, commentId },
	});

	return (
		<React.Fragment>
			<Button
				as='div'
				color='red'
				floated='right'
				onClick={() => setConfirmOpen(true)}
			>
				<Icon name='trash' style={{ margin: 0 }} />
			</Button>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</React.Fragment>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;

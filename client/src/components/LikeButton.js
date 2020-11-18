import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Icon, Label } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likes, likeCount } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find(like => like.username === user.username)) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: {
			postId: id,
		},
	});

	const likeButton = user ? (
		liked ? (
			<Button color='pink' onClick={likePost}>
				<Icon name='heart' />
			</Button>
		) : (
			<Button color='pink' basic onClick={likePost}>
				<Icon name='heart' />
			</Button>
		)
	) : (
		<Button as={Link} to='/login' color='pink' basic>
			<Icon name='heart' />
		</Button>
	);

	return (
		<Button as='div' labelPosition='right'>
			{likeButton}
			<Label basic color='pink' pointing='left'>
				{likeCount}
			</Label>
		</Button>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;

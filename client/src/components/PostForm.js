import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {
	const initialState = { body: '' };
	const { values, onChange, onSubmit } = useForm(
		createPostCallback,
		initialState
	);

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({
				query: FETCH_POSTS_QUERY,
			});
			let newData = [...data.getPosts];
			newData = [result.data.createPost, ...newData];
			proxy.writeQuery({
				query: FETCH_POSTS_QUERY,
				data: {
					...data,
					getPosts: {
						newData,
					},
				},
			});
			values.body = '';
		},
	});

	function createPostCallback() {
		return createPost();
	}

	return (
		<Form onSubmit={onSubmit}>
			<h2>Create a post:</h2>
			<Form.Field>
				<Form.Input
					placeholder='Hi World!'
					name='body'
					value={values.body}
					onChange={onChange}
				/>
				<Button type='submit' color='pink'>
					Submit
				</Button>
			</Form.Field>
		</Form>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likeCount
			commentCount
			likes {
				id
				username
				createdAt
			}
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default PostForm;

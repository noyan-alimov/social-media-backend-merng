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
		onError(err) {
			console.log(err);
		},
	});

	function createPostCallback() {
		return createPost();
	}

	return (
		<React.Fragment>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder='Hi World!'
						name='body'
						value={values.body}
						onChange={onChange}
						error={error ? true : false}
					/>
					<Button type='submit' color='pink'>
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className='ui error message'>
					<ul className='list'>
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</React.Fragment>
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

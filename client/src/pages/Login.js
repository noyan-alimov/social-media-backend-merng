import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../util/hooks';

function Login(props) {
	const [errors, setErrors] = useState({});

	const initialState = {
		username: '',
		password: '',
	};

	const { onChange, onSubmit, values } = useForm(login, initialState);

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(proxy, result) {
			props.history.push('/');
		},
		variables: values,
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
	});

	function login() {
		loginUser();
	}

	return (
		<div className='form-container'>
			<Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''}>
				<h1>Login</h1>
				<Form.Input
					label='Username'
					placeholder='Username...'
					type='text'
					name='username'
					value={values.username}
					onChange={onChange}
					error={errors.username}
				/>
				<Form.Input
					label='Password'
					placeholder='Password...'
					type='password'
					name='password'
					value={values.password}
					onChange={onChange}
					error={errors.password}
				/>
				<Button type='submit' primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className='ui error message'>
					<ul className='list'>
						{Object.values(errors).map(value => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			username
			email
			createdAt
			token
		}
	}
`;

export default Login;

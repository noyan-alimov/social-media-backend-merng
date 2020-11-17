import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../util/hooks';

function Register(props) {
	const [errors, setErrors] = useState({});

	const initialState = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	};

	const { onChange, onSubmit, values } = useForm(register, initialState);

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update(proxy, result) {
			props.history.push('/');
		},
		variables: values,
		onError(err) {
			console.log(err.graphQLErrors);
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
	});

	function register() {
		addUser();
	}

	return (
		<div className='form-container'>
			<Form noValidate onSubmit={onSubmit} className={loading ? 'loading' : ''}>
				<h1>Register</h1>
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
					label='Email'
					placeholder='Email...'
					type='email'
					name='email'
					value={values.email}
					onChange={onChange}
					error={errors.email}
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
				<Form.Input
					label='Confirm Password'
					placeholder='Confirm Password...'
					type='password'
					name='confirmPassword'
					value={values.confirmPassword}
					onChange={onChange}
					error={errors.confirmPassword}
				/>
				<Button type='submit' primary>
					Register
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

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			username
			email
			createdAt
			token
		}
	}
`;

export default Register;

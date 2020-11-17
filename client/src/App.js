import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { Container } from 'semantic-ui-react';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	return (
		<BrowserRouter>
			<Container>
				<MenuBar />
				<Route exact path='/' component={Home} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/register' component={Register} />
			</Container>
		</BrowserRouter>
	);
}

export default App;

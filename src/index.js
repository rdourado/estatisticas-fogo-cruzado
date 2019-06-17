/**
 * External dependencies
 */
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
/**
 * Internal dependencies
 */
import App from './components/App'
import store from './flux/store'

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)

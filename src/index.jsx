/* global FB */
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import App from './components/App'
import store from './flux/store'

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('mapa-fogo-cruzado')
)

window.fbAsyncInit = function() {
	FB.init({
		appId: '2372121396378115',
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v4.0',
	})
}

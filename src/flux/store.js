/**
 * External dependencies
 */
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar'
import createSagaMiddleware from 'redux-saga'

/**
 * Internal dependencies
 */
import reducer from './reducer'
import rootSaga from './sagas'
import preloadedState from './initialState'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
	reducer: { state: reducer, loadingBar },
	preloadedState,
	middleware: [...getDefaultMiddleware(), sagaMiddleware],
})

sagaMiddleware.run(rootSaga)

export default store

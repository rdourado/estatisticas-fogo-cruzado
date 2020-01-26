import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer'
import rootSaga from './sagas'
import preloadedState from './initialState'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = { state: reducer, loadingBar }

const store = configureStore({
	reducer: rootReducer,
	preloadedState,
	middleware: [...getDefaultMiddleware(), sagaMiddleware],
})

sagaMiddleware.run(rootSaga)

if (process.env.NODE_ENV !== 'production' && module.hot) {
	module.hot.accept('./reducer', () => store.replaceReducer(rootReducer))
	module.hot.accept('./sagas', () => store.replaceReducer(rootReducer))
	module.hot.accept('./initialState', () => store.replaceReducer(rootReducer))
}

export default store

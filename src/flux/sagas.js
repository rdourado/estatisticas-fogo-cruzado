/* global mapa_fogo_cruzado */
import { all, call, fork, put, take, takeLatest, actionChannel } from 'redux-saga/effects'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import get from 'lodash/get'
import { selectFilters } from './selectors'
import * as actions from './actions'
import * as Api from './api'
import store from './store'

function* paramsSaga({ payload: uf }) {
	try {
		yield put(showLoading())
		const response = yield call(Api.fetchParams, uf)
		yield put(actions.successParams(response.data))
		yield fork(filtersSaga)
	} catch (e) {
		yield put(actions.failureParams(e.message))
	} finally {
		yield put(hideLoading())
	}
}

function* dataSaga({ payload }) {
	try {
		yield put(showLoading())
		const { firstChunk, secondChunk } = yield all({
			firstChunk: call(Api.fetchData, payload, 0),
			secondChunk: call(Api.fetchData, payload, 1),
		})
		yield put(actions.successData([...firstChunk.data, ...secondChunk.data]))
	} catch (e) {
		yield put(actions.failureData(e.message))
	} finally {
		yield put(hideLoading())
	}
}

function* filtersSaga() {
	const { state } = store.getState()
	const filters = selectFilters(state)
	yield put(actions.requestData(filters))
}

function* graphicsSaga() {
	const channel = yield actionChannel(actions.requestImage)
	while (true) {
		const action = yield take(channel)
		yield imageSaga(action.payload)
	}
}

function* imageSaga(args) {
	try {
		const response = yield call(Api.findImage, args)
		if (response.data) {
			yield put(actions.successImage({ [args.id]: response.data }))
		} else {
			const canvas = yield call(Api.createImage, document.getElementById(args.id))
			const response = yield call(Api.saveImage, {
				base64: canvas.toDataURL('image/png').split(',')[1],
				...args,
			})
			yield response.success
				? put(actions.successImage({ [args.id]: response.data }))
				: put(actions.failureImage('Erro ao gerar imagem'))
		}
	} catch (e) {
		yield put(actions.failureImage(e.message))
	}
}

function* rootSaga() {
	yield fork(graphicsSaga)
	yield takeLatest(actions.requestParams, paramsSaga)
	yield takeLatest(actions.requestData, dataSaga)
	yield takeLatest(actions.updateUF, paramsSaga)
	yield takeLatest(actions.updateYear, filtersSaga)
	yield takeLatest(actions.updateDate, filtersSaga)

	const uf = get(mapa_fogo_cruzado, 'uf', 'rj')
	yield put(actions.requestParams(uf))
}

export default rootSaga

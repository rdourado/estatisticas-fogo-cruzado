/**
 * External dependencies
 */
import { call, fork, put, take, takeLatest, actionChannel } from 'redux-saga/effects'
import { showLoading, hideLoading } from 'react-redux-loading-bar'
/**
 * Internal dependencies
 */
import { selectFilters } from './selectors'
import * as actions from './actions'
import * as Api from './api'
import store from './store'

function* paramsSaga({ payload }) {
	try {
		yield put(showLoading())
		const response = yield call(Api.fetchParams, payload)
		yield put(actions.successParams(response))
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
		const response = yield call(Api.fetchData, payload)
		yield put(actions.successData(response))
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

function* imageSaga({ id, hash }) {
	try {
		const file = yield call(Api.findImage, { hash })
		if (file.data) {
			yield put(actions.successImage({ [hash]: file.data }))
		} else {
			const canvas = yield call(Api.createImage, document.getElementById(id))
			const response = yield call(Api.saveImage, {
				base64: canvas.toDataURL('image/png').split(',')[1],
				hash,
			})
			yield response.success
				? put(actions.successImage({ [hash]: response.data }))
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
	yield takeLatest(actions.updateType, filtersSaga)
	yield takeLatest(actions.updateRegion, filtersSaga)
	yield takeLatest(actions.updateCity, filtersSaga)
	yield takeLatest(actions.updateNBRHD, filtersSaga)
	yield takeLatest(actions.updateDate, filtersSaga)

	yield put(actions.requestParams('rj'))
}

export default rootSaga

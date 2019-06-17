/**
 * External dependencies
 */
import { createReducer } from 'redux-starter-kit'
import extend from 'lodash/extend'
import omit from 'lodash/omit'
import moment from 'moment'
/**
 * Internal dependencies
 */
import initialState from './initialState'
import * as actions from './actions'

const rootReducer = createReducer(initialState, {
	[actions.requestData]: state => extend(state, { isWorking: true }),
	[actions.successData]: (state, { payload: { data } }) =>
		extend(state, { allData: data, isWorking: false, isReady: true }),
	[actions.failureData]: state => extend(state, { isWorking: false, isReady: false }),

	[actions.requestParams]: state => extend(state, { isWorking: true }),
	[actions.successParams]: (state, { payload: { data } }) =>
		extend(state, {
			allUFs: data.ufs,
			allYears: data.years.map(x => +x),
			allParams: data.params,
			isWorking: false,
		}),
	[actions.failureParams]: state => extend(state, { isWorking: false }),

	[actions.updateUF]: (state, { payload }) =>
		extend(state, { ...omit(initialState, 'allUFs'), currentUF: payload }),
	[actions.updateYear]: (state, { payload }) =>
		extend(state, {
			currentYear: +payload,
			currentDateRange: [
				moment
					.unix(state.currentDateRange[0])
					.year(+payload)
					.unix(),
				moment
					.unix(state.currentDateRange[1])
					.year(+payload)
					.unix(),
			],
		}),
	[actions.updateDate]: (state, { payload }) => extend(state, { currentDateRange: payload }),
	[actions.updateRegion]: ({ currentRegion, ...state }, { payload }) =>
		extend(state, {
			currentRegion: currentRegion !== payload ? payload : null,
			currentCities: [],
			currentNBRHDs: [],
		}),
	[actions.updateCity]: ({ currentCities, ...state }, { payload }) =>
		extend(state, {
			currentNBRHDs: [],
			currentCities:
				currentCities.indexOf(payload) >= 0
					? currentCities.filter(x => x !== payload)
					: [...currentCities, payload],
		}),
	[actions.updateNBRHD]: ({ currentNBRHDs, ...state }, { payload }) =>
		extend(state, {
			currentNBRHDs:
				currentNBRHDs.indexOf(payload) >= 0
					? currentNBRHDs.filter(x => x !== payload)
					: [...currentNBRHDs, payload],
		}),
	[actions.updateType]: ({ currentType, ...state }, { payload }) =>
		extend(state, { currentType: currentType !== payload ? payload : null }),

	[actions.successImage]: (state, { payload }) =>
		extend(state, { allGraphics: { ...state.allGraphics, ...payload } }),
})

export default rootReducer

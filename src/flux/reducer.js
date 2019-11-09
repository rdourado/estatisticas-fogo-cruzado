import { createReducer } from 'redux-starter-kit'
import extend from 'lodash/extend'
import lowerCase from 'lodash/lowerCase'
import moment from 'moment'
import { selectLocations, selectData, selectYears, selectCurrentYear } from './selectors'
import { UF, YEAR, REGION, DATE, NBRHD, TYPE, CITY, VAR } from '../shared/types'
import * as actions from './actions'
import initialState from './initialState'

const rootReducer = createReducer(initialState, {
	[actions.requestData]: state => extend(state, { isUpdating: true }),
	[actions.failureData]: state => extend(state, { isUpdating: false, isReady: false }),
	[actions.successData]: (state, { payload }) => {
		const yearData = selectCurrentYear(state)
		const validDateRange = [yearData.firstDate, yearData.lastDate]
		return extend(state, {
			allData: selectData(payload),
			changingParam: null,
			isReady: true,
			isUpdating: false,
			validDateRange,
		})
	},

	[actions.requestParams]: state => extend(state, { isUpdating: true }),
	[actions.failureParams]: state => extend(state, { isUpdating: false }),
	[actions.successParams]: (state, { payload }) => {
		const isFromVar = state.changingParam === VAR
		const allYears = selectYears(payload.years)
		const currentYear = isFromVar ? state.currentYear : allYears[0].year
		const year = allYears.find(({ year }) => year === currentYear)
		const validDateRange = [year.firstDate, year.lastDate]
		return extend(state, {
			allLocations: selectLocations(payload),
			allUFs: payload.ufs.map(lowerCase),
			allYears,
			currentDateRange: isFromVar ? state.currentDateRange : validDateRange,
			currentYear,
			isUpdating: false,
			validDateRange,
		})
	},

	[actions.updateUF]: (state, { payload }) =>
		extend(state, {
			currentUF: payload,
			currentType: null,
			currentRegions: [],
			currentCities: [],
			currentNBRHDs: [],
			changingParam: UF,
		}),

	[actions.updateYear]: (state, { payload }) => {
		const yearData = selectCurrentYear({ ...state, currentYear: payload })
		let validDateRange = [yearData.firstDate, yearData.lastDate]
		if (state.hasDateChanged) {
			const diffYear = payload - state.currentYear
			const currentDateRange = state.currentDateRange.map(date =>
				moment.unix(date).add(diffYear, 'year')
			)
			validDateRange = [
				currentDateRange[0].isSameOrAfter(moment.unix(yearData.firstDate), 'day')
					? currentDateRange[0].unix()
					: yearData.firstDate,
				currentDateRange[1].isSameOrBefore(moment.unix(yearData.lastDate), 'day')
					? currentDateRange[1].unix()
					: yearData.lastDate,
			]
		}
		return extend(state, {
			currentYear: payload,
			currentDateRange: validDateRange,
			validDateRange,
			changingParam: YEAR,
		})
	},

	[actions.updateRegion]: ({ currentRegions, ...state }, { payload }) =>
		extend(state, {
			currentCities: [],
			currentNBRHDs: [],
			currentRegions: currentRegions.includes(payload)
				? currentRegions.filter(region => region !== payload)
				: [...currentRegions, payload],
			changingParam: REGION,
		}),

	[actions.updateDate]: (state, { payload }) =>
		extend(state, { currentDateRange: payload, changingParam: DATE, hasDateChanged: true }),

	[actions.updateCity]: ({ currentCities, ...state }, { payload }) =>
		extend(state, {
			currentNBRHDs: [],
			currentCities: currentCities.includes(payload)
				? currentCities.filter(x => x !== payload)
				: [...currentCities, payload],
			changingParam: CITY,
		}),

	[actions.updateNBRHD]: ({ currentNBRHDs, ...state }, { payload }) =>
		extend(state, {
			currentNBRHDs: currentNBRHDs.includes(payload)
				? currentNBRHDs.filter(x => x !== payload)
				: [...currentNBRHDs, payload],
			changingParam: NBRHD,
		}),

	[actions.updateType]: ({ currentType, ...state }, { payload }) =>
		extend(state, {
			currentType: currentType !== payload ? payload : null,
			changingParam: TYPE,
		}),

	[actions.successImage]: (state, { payload }) =>
		extend(state, { allGraphics: { ...state.allGraphics, ...payload } }),
})

export default rootReducer

/**
 * External dependencies
 */
import moment from 'moment'

const now = moment()
const currentYear = +now.format('YYYY')
const currentMonth = +now.unix()
const prevMonth = +moment('01-01', 'DD-MM').unix()

const initialState = {
	state: {
		isReady: null,
		isWorking: false,

		allUFs: [],
		allYears: [],
		allTypes: [
			{ label: 'Feridos', value: 'injured' },
			{ label: 'Mortos', value: 'dead' },
			{ label: 'Sem vítimas', value: 'none' },
		],
		allParams: [],
		allData: [],
		allGraphics: {},

		currentUF: 'rj',
		currentYear,
		currentDateRange: [prevMonth, currentMonth],
		currentType: null,
		currentRegion: null,
		currentCities: [],
		currentNBRHDs: [],
	},
}

export default initialState

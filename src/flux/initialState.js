/* global mapa_fogo_cruzado */
import get from 'lodash/get'
import moment from 'moment'
import parseInt from 'lodash/parseInt'
import { INJURED, DEAD, NONE, UF, VAR } from '../shared/types'

const now = moment()
const currentYear = parseInt(now.format('YYYY'))
const today = now.unix()
const startOfYear = now.startOf('year').unix()

const initialState = {
	state: {
		isReady: null,
		isUpdating: false,
		changingParam: mapa_fogo_cruzado.uf ? VAR : UF,
		validDateRange: [startOfYear, today],
		hasDateChanged: false,

		allData: [],
		allUFs: [],
		allYears: [],
		allTypes: [
			{ label: INJURED, value: 'injured' },
			{ label: DEAD, value: 'dead' },
			{ label: NONE, value: 'none' },
		],
		allLocations: [],
		allGraphics: {},

		currentUF: get(mapa_fogo_cruzado, 'uf', 'rj'),
		currentYear: parseInt(get(mapa_fogo_cruzado, 'year', currentYear)),
		currentDateRange: get(mapa_fogo_cruzado, 'dates', [startOfYear, today]),
		currentType: get(mapa_fogo_cruzado, 'type', null),
		currentRegions: get(mapa_fogo_cruzado, 'regions', []),
		currentCities: get(mapa_fogo_cruzado, 'cities', []),
		currentNBRHDs: get(mapa_fogo_cruzado, 'nbrhds', []),
	},
}

export default Object.freeze(initialState)

import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import kebabCase from 'lodash/kebabCase'
import keys from 'lodash/keys'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import moment from 'moment'
import omit from 'lodash/omit'
import orderBy from 'lodash/orderBy'
import parseInt from 'lodash/parseInt'
import reverse from 'lodash/reverse'
import sumBy from 'lodash/sumBy'
import take from 'lodash/take'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { UF, YEAR, MONTH, CITY, NBRHD, REGION, UPP } from '../shared/types'

import 'moment/locale/pt-br'
moment.locale('pt-br')

// API selectors

const payloadLocations = payload => payload.locations

export const selectLocations = createSelector(
	payloadLocations,
	locations =>
		mapValues(groupBy(locations, REGION), location =>
			mapValues(groupBy(location, CITY), location => filter(map(location, NBRHD)))
		)
)

export const selectData = data =>
	data.map(row => ({
		date: moment(row.date).unix(),
		lat: parseFloat(row.lat),
		lng: parseFloat(row.lng),
		police: parseInt(row.police) === 1,
		police_dead: parseInt(row.police_dead),
		police_hurt: parseInt(row.police_hurt),
		civil_dead: parseInt(row.civil_dead),
		civil_hurt: parseInt(row.civil_hurt),
		total_dead: parseInt(row.civil_dead) + parseInt(row.police_dead),
		total_hurt: parseInt(row.civil_hurt) + parseInt(row.police_hurt),
		massacre: parseInt(row.massacre) === 1,
		uf: row.uf.toLowerCase(),
		region: row.region,
		city: row.city,
		nbrhd: { name: row.nbrhd, id: kebabCase(`${row.city}-${row.nbrhd}`) },
		upp: row.upp,
	}))

export const selectYears = years =>
	years.map(row => ({
		year: parseInt(row.year),
		firstDate: moment(row.first)
			.startOf('day')
			.unix(),
		lastDate: moment(row.last)
			.endOf('day')
			.unix(),
	}))

export const selectDateRange = (state, response) => {
	if ([UF, YEAR].includes(state.changingParam)) {
		const timeline = map(response, 'date')
		const lastDate = moment(timeline[0])
		const firstDate = reverse(timeline).find(date => lastDate.isSame(date, 'year'))
		return [moment(firstDate).unix(), lastDate.unix()]
	}
	return state.currentDateRange
}

// Redux selectors

const pickUF = state => state.currentUF
const pickYear = state => state.currentYear
const pickYears = state => state.allYears
const pickDateRange = state => state.currentDateRange
const pickType = state => state.currentType
const pickRegions = state => state.currentRegions || []
const pickCities = state => state.currentCities || []
const pickNBRHDs = state => state.currentNBRHDs || []
const pickData = state => state.allData || []
const pickLocations = state => state.allLocations || []

export const selectFilters = createSelector(
	[pickUF, pickYear, pickDateRange, pickType, pickRegions, pickCities, pickNBRHDs],
	(uf, year, dates, type, regions, cities, nbrhds) => ({
		uf,
		year,
		dates,
		type,
		regions,
		cities,
		nbrhds,
	})
)

export const selectValidData = createSelector(
	[pickData, pickDateRange],
	(data, dateRange) => {
		const firstDate = moment.unix(dateRange[0])
		const lastDate = moment.unix(dateRange[1])
		const isDateValid = date => moment.unix(date).isBetween(firstDate, lastDate, null, '[]')
		return data.filter(row => isDateValid(row.date))
	}
)

export const selectValidDataByRegions = createSelector(
	[selectValidData, pickRegions],
	(data, regions) =>
		regions.length === 0 ? data : data.filter(row => regions.includes(row.region))
)

export const selectValidDataByCities = createSelector(
	[selectValidDataByRegions, pickCities],
	(data, cities) => (cities.length === 0 ? data : data.filter(row => cities.includes(row.city)))
)

export const selectValidDataByNBRHDs = createSelector(
	[selectValidDataByCities, pickNBRHDs],
	(data, nbrhds) =>
		nbrhds.length === 0
			? data
			: data.filter(row => nbrhds.includes(row.nbrhd.name || row.nbrhd))
)

export const selectCurrentYear = createSelector(
	[pickYears, pickYear],
	(years, currentYear) => years.find(({ year }) => year === currentYear)
)

export const selectRegions = createSelector(
	pickLocations,
	locations => uniq(keys(locations)).sort()
)

export const selectMarkers = createSelector(
	selectValidDataByNBRHDs,
	data => data.map(row => ({ lat: row.lat, lng: row.lng }))
)

export const selectStats = createSelector(
	selectValidDataByNBRHDs,
	data => ({
		shootings: data.length,
		policeTotal: sumBy(data, row => (row.police ? 1 : 0)),
		policeDead: sumBy(data, row => row.police_dead),
		policeHurt: sumBy(data, row => row.police_hurt),
		peopleDead: sumBy(data, row => row.civil_dead + row.police_dead),
		peopleHurt: sumBy(data, row => row.civil_hurt + row.police_hurt),
	})
)

export const selectCities = createSelector(
	[pickLocations, pickRegions],
	(locations, regions) => {
		const cities = regions.flatMap(region => keys(locations[region]))
		return uniq(cities).sort()
	}
)

export const selectNBRHDs = createSelector(
	[pickLocations, pickRegions, pickCities],
	(locations, regions, cities) =>
		regions.flatMap(region => cities.flatMap(city => locations[region][city]))
)

// Graphics selectors

const pickDataBy = (key, iteratee = x => x) => state => {
	const groupByKey = row =>
		key !== MONTH ? row[key].id || row[key] : moment.unix(row.date).format('MMMM')
	const createValue = (values, keyValue) => ({
		[key]: get(values, `[0].${key}.name`, keyValue),
		value: iteratee(values),
	})

	const data = selectValidDataByNBRHDs(state)
	const groupedData = omit(groupBy(data, groupByKey), [''])
	const finalData = map(groupedData, createValue)
	const orderedData = orderBy(finalData, key !== MONTH ? 'value' : null, 'desc')

	return take(orderedData, key !== MONTH ? 10 : 12)
}

const sumByKey = key => arr => sumBy(map(arr, key), x => +x)

export const selectShootingsByMonth = createSelector(
	pickDataBy(MONTH, months => months.length),
	data => ({
		labels: map(data, MONTH),
		data: map(data, 'value'),
	})
)

export const selectDeathsByMonth = createSelector(
	pickDataBy(MONTH, sumByKey('total_dead')),
	data => ({
		labels: map(data, MONTH),
		data: map(data, 'value'),
	})
)

export const selectHurtsByMonth = createSelector(
	pickDataBy(MONTH, sumByKey('total_hurt')),
	data => ({
		labels: map(data, MONTH),
		data: map(data, 'value'),
	})
)

export const selectShootingsByRegions = createSelector(
	pickDataBy(REGION, regions => regions.length),
	data => ({
		labels: map(data, REGION),
		data: map(data, 'value'),
	})
)

export const selectDeathsByRegions = createSelector(
	pickDataBy(REGION, sumByKey('total_dead')),
	data => ({
		labels: map(data, REGION),
		data: map(data, 'value'),
	})
)

export const selectHurtsByRegions = createSelector(
	pickDataBy(REGION, sumByKey('total_hurt')),
	data => ({
		labels: map(data, REGION),
		data: map(data, 'value'),
	})
)

export const selectShootingsByCities = createSelector(
	pickDataBy(CITY, cities => cities.length),
	data => ({
		labels: map(data, CITY),
		data: map(data, 'value'),
	})
)

export const selectDeathsByCities = createSelector(
	pickDataBy(CITY, sumByKey('total_dead')),
	data => ({
		labels: map(data, CITY),
		data: map(data, 'value'),
	})
)

export const selectHurtsByCities = createSelector(
	pickDataBy(CITY, sumByKey('total_hurt')),
	data => ({
		labels: map(data, CITY),
		data: map(data, 'value'),
	})
)

export const selectShootingsByNBRHDs = createSelector(
	pickDataBy(NBRHD, nbrhds => nbrhds.length),
	data => ({
		labels: map(data, NBRHD),
		data: map(data, 'value'),
	})
)

export const selectDeathsByNBRHDs = createSelector(
	pickDataBy(NBRHD, sumByKey('total_dead')),
	data => ({
		labels: map(data, NBRHD),
		data: map(data, 'value'),
	})
)

export const selectHurtsByNBRHDs = createSelector(
	pickDataBy(NBRHD, sumByKey('total_hurt')),
	data => ({
		labels: map(data, NBRHD),
		data: map(data, 'value'),
	})
)

export const selectShootingsByUPPs = createSelector(
	pickDataBy(UPP, upps => upps.length),
	data => ({
		labels: map(data, UPP),
		data: map(data, 'value'),
	})
)

export const selectDeathsByUPPs = createSelector(
	pickDataBy(UPP, sumByKey('total_dead')),
	data => ({
		labels: map(data, UPP),
		data: map(data, 'value'),
	})
)

export const selectHurtsByUPPs = createSelector(
	pickDataBy(UPP, sumByKey('total_hurt')),
	data => ({
		labels: map(data, UPP),
		data: map(data, 'value'),
	})
)

export const selectAgentDeathsByMonth = createSelector(
	pickDataBy(MONTH, sumByKey('police_dead')),
	data => ({
		labels: map(data, MONTH),
		data: map(data, 'value'),
	})
)

export const selectAgentHurtsByMonth = createSelector(
	pickDataBy(MONTH, sumByKey('police_hurt')),
	data => ({
		labels: map(data, MONTH),
		data: map(data, 'value'),
	})
)

export const selectMassacresByCities = createSelector(
	pickDataBy(CITY, sumByKey('massacre')),
	data => ({
		labels: map(data, CITY),
		data: map(data, 'value'),
	})
)

/**
 * External dependencies
 */
import { createSelector } from 'reselect'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import take from 'lodash/take'
import uniq from 'lodash/uniq'
import 'moment/locale/pt-br'

moment.locale('pt-br')

const pickUF = state => state.currentUF
// const pickYear = state => state.currentYear
const pickDateRange = state => state.currentDateRange
const pickType = state => state.currentType
const pickRegion = state => state.currentRegion
const pickCities = state => state.currentCities || []
const pickNBRHDs = state => state.currentNBRHDs || []
const pickData = state => state.allData || []
const pickParams = state => state.allParams || []

export const selectFilters = createSelector(
	[pickDateRange, pickType, pickUF, pickRegion, pickCities, pickNBRHDs],
	([start, end], type, uf, region, cities, nbrhds) => ({
		start,
		end,
		type,
		uf,
		region,
		cities,
		nbrhds,
	})
)

export const selectValidData = createSelector(
	[pickData, pickDateRange],
	(data, [start, end]) =>
		data.filter(x => moment(x.date).isBetween(moment.unix(start), moment.unix(end), null, '[]'))
)

export const selectRegions = createSelector(
	pickParams,
	params => uniq(map(params, 'region')).sort()
)

export const selectCities = createSelector(
	[pickParams, pickRegion],
	(params, region) => (!region ? [] : uniq(map(groupBy(params, 'region')[region], 'city'))).sort()
)

export const selectNBRHDs = createSelector(
	[pickParams, pickRegion, pickCities],
	(params, region, cities) =>
		!region || !cities
			? []
			: uniq(
					map(
						groupBy(params, 'region')[region].filter(x => cities.indexOf(x.city) >= 0),
						'nbrhd'
					)
			  ).sort()
)

export const selectMarkers = createSelector(
	selectValidData,
	data => data.map(x => ({ lat: +x.latitude, lng: +x.longitude }))
)

export const selectStats = createSelector(
	selectValidData,
	data => ({
		total: data.length,
		dead: sumBy(data, x => +x.total_dead),
		injured: sumBy(data, x => +x.total_injured),
		policeTotal: sumBy(data, x => +x.had_police),
		policeDead: sumBy(data, x => +x.police_dead),
		policeInjured: sumBy(data, x => +x.police_injured),
	})
)

const pickDataBy = (key, iteratee = x => x) => state =>
	take(
		orderBy(
			map(
				groupBy(pickData(state), x =>
					key !== 'month' ? x[key] : moment(x.date).format('MMMM')
				),
				(arr, _key) => ({ [key]: _key, value: iteratee(arr) })
			),
			key !== 'month' ? 'value' : null,
			'desc'
		),
		key !== 'month' ? 10 : 12
	)

const sumByKey = key => arr => sumBy(map(arr, key), x => +x)

export const selectShootingsByCities = createSelector(
	pickDataBy('city', x => x.length),
	data => ({
		labels: map(data, 'city'),
		data: map(data, 'value'),
	})
)

export const selectDeathsByCities = createSelector(
	pickDataBy('city', sumByKey('total_dead')),
	data => ({
		labels: map(data, 'city'),
		data: map(data, 'value'),
	})
)

export const selectInjuresByCities = createSelector(
	pickDataBy('city', sumByKey('total_injured')),
	data => ({
		labels: map(data, 'city'),
		data: map(data, 'value'),
	})
)

export const selectShootingsByNBRHDs = createSelector(
	pickDataBy('nbrhd', x => x.length),
	data => ({
		labels: map(data, 'nbrhd'),
		data: map(data, 'value'),
	})
)

export const selectDeathsByNBRHDs = createSelector(
	pickDataBy('nbrhd', sumByKey('total_dead')),
	data => ({
		labels: map(data, 'nbrhd'),
		data: map(data, 'value'),
	})
)

export const selectInjuresByNBRHDs = createSelector(
	pickDataBy('nbrhd', sumByKey('total_injured')),
	data => ({
		labels: map(data, 'nbrhd'),
		data: map(data, 'value'),
	})
)

export const selectShootingsByMonth = createSelector(
	pickDataBy('month', x => x.length),
	data => ({
		labels: map(data, 'month'),
		data: map(data, 'value'),
	})
)

export const selectDeathsByMonth = createSelector(
	pickDataBy('month', sumByKey('total_dead')),
	data => ({
		labels: map(data, 'month'),
		data: map(data, 'value'),
	})
)

export const selectInjuresByMonth = createSelector(
	pickDataBy('month', sumByKey('total_injured')),
	data => ({
		labels: map(data, 'month'),
		data: map(data, 'value'),
	})
)

export const selectShootingsByRegions = createSelector(
	pickDataBy('region', x => x.length),
	data => ({
		labels: map(data, 'region'),
		data: map(data, 'value'),
	})
)

export const selectDeathsByRegions = createSelector(
	pickDataBy('region', sumByKey('total_dead')),
	data => ({
		labels: map(data, 'region'),
		data: map(data, 'value'),
	})
)

export const selectInjuresByRegions = createSelector(
	pickDataBy('region', sumByKey('total_injured')),
	data => ({
		labels: map(data, 'region'),
		data: map(data, 'value'),
	})
)

export const selectAgentDeathsByMonth = createSelector(
	pickDataBy('month', sumByKey('police_dead')),
	data => ({
		labels: map(data, 'month'),
		data: map(data, 'value'),
	})
)

export const selectAgentInjuresByMonth = createSelector(
	pickDataBy('month', sumByKey('police_injured')),
	data => ({
		labels: map(data, 'month'),
		data: map(data, 'value'),
	})
)

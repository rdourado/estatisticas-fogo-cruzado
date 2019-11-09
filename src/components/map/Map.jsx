import React from 'react'
import { arrayOf, func, number, shape, string } from 'prop-types'
import styled from 'styled-components'
import CurrentFilters from './CurrentFilters'
import GoogleMap from './GoogleMap'
import Legend from './Legend'

const Map = props => (
	<>
		<Main>
			<GoogleMap markers={props.markers} />
		</Main>
		<Legend stats={props.stats} />
		<CurrentFilters
			allTypes={props.allTypes}
			currentUF={props.currentUF}
			currentYear={props.currentYear}
			currentType={props.currentType}
			currentRegions={props.currentRegions}
			currentCities={props.currentCities}
			currentNBRHDs={props.currentNBRHDs}
			currentDateRange={props.currentDateRange}
			onSelect={props.onSelect}
		/>
	</>
)

Map.propTypes = {
	allTypes: arrayOf(
		shape({
			label: string,
			value: string,
		})
	).isRequired,
	currentCities: arrayOf(string).isRequired,
	currentDateRange: arrayOf(number).isRequired,
	currentNBRHDs: arrayOf(string).isRequired,
	currentRegions: arrayOf(string).isRequired,
	currentUF: string.isRequired,
	currentYear: number.isRequired,
	markers: arrayOf(
		shape({
			lat: number,
			lng: number,
		})
	).isRequired,
	onSelect: func.isRequired,
	stats: shape({
		peopleDead: number,
		peopleHurt: number,
		policeDead: number,
		policeHurt: number,
		policeTotal: number,
		shootings: number,
	}).isRequired,
	currentType: string,
}

const Main = styled.div`
	height: 440px;
	position: relative;
`

export default Map

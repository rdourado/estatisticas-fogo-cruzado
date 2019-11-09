import React from 'react'
import { arrayOf, number, object, shape, string } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import pick from 'lodash/pick'
import { selectMarkers, selectStats } from '../../flux/selectors'
import { TYPE, REGION, CITY, NBRHD, DATE } from '../../shared/types'
import * as actions from '../../flux/actions'
import Map from './Map'

const MapContainer = props => {
	const onSelectParam = param => value => {
		switch (param) {
			case TYPE:
				return props.actions.updateType(value)

			case REGION:
				return props.actions.updateRegion(value)

			case CITY:
				return props.actions.updateCity(value)

			case NBRHD:
				return props.actions.updateNBRHD(value)

			case DATE:
				return props.actions.updateDate(value)

			default:
				return false
		}
	}

	return (
		<Map
			allTypes={props.allTypes}
			currentCities={props.currentCities}
			currentDateRange={props.currentDateRange}
			currentNBRHDs={props.currentNBRHDs}
			currentRegions={props.currentRegions}
			currentType={props.currentType}
			currentUF={props.currentUF}
			currentYear={props.currentYear}
			markers={props.markers}
			onSelect={onSelectParam}
			stats={props.stats}
		/>
	)
}

MapContainer.propTypes = {
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
	stats: shape({
		peopleDead: number,
		peopleHurt: number,
		policeDead: number,
		policeHurt: number,
		policeTotal: number,
		shootings: number,
	}).isRequired,
	actions: object,
	currentType: string,
}

const mapStateToProps = ({ state }) => ({
	allTypes: state.allTypes,
	currentCities: state.currentCities,
	currentDateRange: state.currentDateRange,
	currentNBRHDs: state.currentNBRHDs,
	currentRegions: state.currentRegions,
	currentType: state.currentType,
	currentUF: state.currentUF,
	currentYear: state.currentYear,
	markers: selectMarkers(state),
	stats: selectStats(state),
})

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(
		pick(actions, ['updateType', 'updateRegion', 'updateCity', 'updateNBRHD', 'updateDate']),
		dispatch
	),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapContainer)

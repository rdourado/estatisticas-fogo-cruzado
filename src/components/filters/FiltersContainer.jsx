import React from 'react'
import { arrayOf, object, shape, string, number } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import pick from 'lodash/pick'
import { selectRegions, selectCities, selectNBRHDs } from '../../flux/selectors'
import * as actions from '../../flux/actions'
import Primary from './Primary'
import Secondary from './Secondary'

const FiltersContainer = props => {
	const dispatchSelectUF = uf => props.actions.updateUF(uf)

	const onSelectYear = year => props.actions.updateYear(year)

	const onSelectParam = param => value => {
		const { actions } = props
		switch (param) {
			case 'type':
				return actions.updateType(value)

			case 'region':
				return actions.updateRegion(value)

			case 'city':
				return actions.updateCity(value)

			case 'nbrhd':
				return actions.updateNBRHD(value)

			case 'date':
				return actions.updateDate(value)

			default:
				return false
		}
	}

	const validateDate = date =>
		date.isSame(moment().year(props.currentYear), 'year') &&
		date.isBetween(
			moment.unix(props.validDateRange[0]),
			moment.unix(props.validDateRange[1]),
			'day',
			'[]'
		)

	return (
		<nav>
			<Primary
				allUFs={props.allUFs}
				allYears={props.allYears}
				currentUF={props.currentUF}
				currentYear={props.currentYear}
				dispatchSelectUF={dispatchSelectUF}
				onSelectYear={onSelectYear}
			/>
			<Secondary
				allTypes={props.allTypes}
				allRegions={props.allRegions}
				allCities={props.allCities}
				allNBRHDs={props.allNBRHDs}
				currentType={props.currentType}
				currentRegions={props.currentRegions}
				currentCities={props.currentCities}
				currentNBRHDs={props.currentNBRHDs}
				currentDateRange={props.currentDateRange}
				onSelect={onSelectParam}
				validateDate={validateDate}
			/>
		</nav>
	)
}

FiltersContainer.propTypes = {
	actions: object,
	allUFs: arrayOf(string),
	allYears: arrayOf(
		shape({
			year: number,
			firstDate: number,
			lastDate: number,
		})
	),
	allTypes: arrayOf(
		shape({
			label: string,
			value: string,
		})
	),
	allRegions: arrayOf(string),
	allCities: arrayOf(string),
	allNBRHDs: arrayOf(string),
	currentUF: string,
	currentYear: number,
	currentType: string,
	currentRegions: arrayOf(string),
	currentCities: arrayOf(string),
	currentNBRHDs: arrayOf(string),
	currentDateRange: arrayOf(number),
	validDateRange: arrayOf(number),
}

const mapStateToProps = ({ state }) => ({
	allUFs: state.allUFs,
	allYears: state.allYears,
	allTypes: state.allTypes,
	allRegions: selectRegions(state),
	allCities: selectCities(state),
	allNBRHDs: selectNBRHDs(state),
	currentUF: state.currentUF,
	currentYear: state.currentYear,
	currentType: state.currentType,
	currentRegions: state.currentRegions,
	currentCities: state.currentCities,
	currentNBRHDs: state.currentNBRHDs,
	currentDateRange: state.currentDateRange,
	validDateRange: state.validDateRange,
})

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(
		pick(actions, [
			'updateUF',
			'updateYear',
			'updateType',
			'updateRegion',
			'updateCity',
			'updateNBRHD',
			'updateDate',
		]),
		dispatch
	),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FiltersContainer)

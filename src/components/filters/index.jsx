/**
 * External dependencies
 */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { arrayOf, object, shape, string, number } from 'prop-types'
import moment from 'moment'
import pick from 'lodash/pick'
/**
 * Internal dependencies
 */
import * as actions from '../../flux/actions'
import { selectRegions, selectCities, selectNBRHDs } from '../../flux/selectors'
import Primary from './Primary'
import Secondary from './Secondary'

class FiltersContainer extends React.Component {
	onSelectUF = uf => this.props.actions.updateUF(uf)

	onSelectYear = year => this.props.actions.updateYear(year)

	onSelectParam = param => value => {
		const { actions } = this.props
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

	validateDate = date =>
		date.isSame(moment().year(this.props.currentYear), 'year') &&
		date.isSameOrBefore(moment(), 'day')

	render() {
		return (
			<nav>
				<Primary
					allUFs={this.props.allUFs}
					allYears={this.props.allYears}
					currentUF={this.props.currentUF}
					currentYear={this.props.currentYear}
					onSelectUF={this.onSelectUF}
					onSelectYear={this.onSelectYear}
				/>
				<Secondary
					allTypes={this.props.allTypes}
					allRegions={this.props.allRegions}
					allCities={this.props.allCities}
					allNBRHDs={this.props.allNBRHDs}
					currentType={this.props.currentType}
					currentRegion={this.props.currentRegion}
					currentCities={this.props.currentCities}
					currentNBRHDs={this.props.currentNBRHDs}
					currentDateRange={this.props.currentDateRange}
					onSelect={this.onSelectParam}
					validateDate={this.validateDate}
				/>
			</nav>
		)
	}
}

FiltersContainer.propTypes = {
	actions: object,
	allUFs: arrayOf(string),
	allYears: arrayOf(number),
	allTypes: arrayOf(shape({ label: string, value: string })),
	allRegions: arrayOf(string),
	currentUF: string,
	currentYear: number,
	currentType: string,
	currentRegion: string,
	currentCities: arrayOf(string),
	currentNBRHDs: arrayOf(string),
	currentDateRange: arrayOf(number),
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
	currentRegion: state.currentRegion,
	currentCities: state.currentCities,
	currentNBRHDs: state.currentNBRHDs,
	currentDateRange: state.currentDateRange,
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

import React from 'react'
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { requestImage } from '../../flux/actions'
import {
	selectAgentDeathsByMonth,
	selectAgentHurtsByMonth,
	selectDeathsByCities,
	selectDeathsByMonth,
	selectDeathsByNBRHDs,
	selectDeathsByRegions,
	selectDeathsByUPPs,
	selectHurtsByCities,
	selectHurtsByMonth,
	selectHurtsByNBRHDs,
	selectHurtsByRegions,
	selectHurtsByUPPs,
	selectMassacresByCities,
	selectShootingsByCities,
	selectShootingsByMonth,
	selectShootingsByNBRHDs,
	selectShootingsByRegions,
	selectShootingsByUPPs,
	selectFilters,
} from '../../flux/selectors'
import Grid from './Grid'

const GraphicsContainer = props => {
	return <Grid {...props} />
}

GraphicsContainer.propTypes = {
	agentDeathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentHurtsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	filters: object,
	currentDateRange: arrayOf(number).isRequired,
	deathsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	graphics: object,
	injuresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	isWorking: bool,
	massacresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	requestImage: func,
	shootingsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	validDateRange: arrayOf(number).isRequired,
}

const mapStateToProps = ({ state }) => ({
	filters: selectFilters(state),
	agentDeathsByMonth: selectAgentDeathsByMonth(state),
	agentHurtsByMonth: selectAgentHurtsByMonth(state),
	currentDateRange: state.currentDateRange,
	deathsByCities: selectDeathsByCities(state),
	deathsByMonth: selectDeathsByMonth(state),
	deathsByNBRHDs: selectDeathsByNBRHDs(state),
	deathsByRegions: selectDeathsByRegions(state),
	deathsByUPPs: selectDeathsByUPPs(state),
	graphics: state.allGraphics,
	injuresByCities: selectHurtsByCities(state),
	injuresByMonth: selectHurtsByMonth(state),
	injuresByNBRHDs: selectHurtsByNBRHDs(state),
	injuresByRegions: selectHurtsByRegions(state),
	injuresByUPPs: selectHurtsByUPPs(state),
	isWorking: state.isWorking,
	massacresByCities: selectMassacresByCities(state),
	shootingsByCities: selectShootingsByCities(state),
	shootingsByMonth: selectShootingsByMonth(state),
	shootingsByNBRHDs: selectShootingsByNBRHDs(state),
	shootingsByRegions: selectShootingsByRegions(state),
	shootingsByUPPs: selectShootingsByUPPs(state),
	validDateRange: state.validDateRange,
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({ requestImage }, dispatch),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GraphicsContainer)

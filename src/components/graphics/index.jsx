/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
/**
 * Internal dependencies
 */
import * as sel from '../../flux/selectors'
import { requestImage } from '../../flux/actions'
import Grid from './Grid'

class GraphicsContainer extends React.Component {
	state = { hasChanged: true }

	componentDidUpdate(prevProps) {
		if (prevProps.isWorking !== this.props.isWorking) {
			const hasChanged = !prevProps.isWorking && !!this.props.isWorking
			this.setState({ hasChanged })
		}
	}

	render() {
		return <Grid {...this.props} {...this.state} />
	}
}

GraphicsContainer.propTypes = {
	isWorking: bool,
	graphics: object,
	shootingsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentDeathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentInjuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	requestImage: func,
}

const mapStateToProps = ({ state }) => ({
	isWorking: state.isWorking,
	graphics: state.allGraphics,
	shootingsByCities: sel.selectShootingsByCities(state),
	deathsByCities: sel.selectDeathsByCities(state),
	injuresByCities: sel.selectInjuresByCities(state),
	shootingsByNBRHDs: sel.selectShootingsByNBRHDs(state),
	deathsByNBRHDs: sel.selectDeathsByNBRHDs(state),
	injuresByNBRHDs: sel.selectInjuresByNBRHDs(state),
	shootingsByMonth: sel.selectShootingsByMonth(state),
	deathsByMonth: sel.selectDeathsByMonth(state),
	injuresByMonth: sel.selectInjuresByMonth(state),
	shootingsByRegions: sel.selectShootingsByRegions(state),
	deathsByRegions: sel.selectDeathsByRegions(state),
	injuresByRegions: sel.selectInjuresByRegions(state),
	agentDeathsByMonth: sel.selectAgentDeathsByMonth(state),
	agentInjuresByMonth: sel.selectAgentInjuresByMonth(state),
})

const mapDispatchToProps = dispatch => ({
	...bindActionCreators({ requestImage }, dispatch),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GraphicsContainer)

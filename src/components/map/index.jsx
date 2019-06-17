/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, number, shape } from 'prop-types'
import { connect } from 'react-redux'
/**
 * Internal dependencies
 */
import { selectMarkers, selectStats } from '../../flux/selectors'
import Map from './Map'

class MapContainer extends React.Component {
	render() {
		const { markers, stats } = this.props

		return <Map markers={markers} stats={stats} />
	}
}

MapContainer.propTypes = {
	markers: arrayOf(
		shape({
			lat: number,
			lng: number,
		})
	),
	stats: shape({
		total: number,
		dead: number,
		injured: number,
		policeTotal: number,
		policeDead: number,
		policeInjured: number,
	}),
}

const mapStateToProps = ({ state }) => ({
	markers: selectMarkers(state),
	stats: selectStats(state),
})

export default connect(mapStateToProps)(MapContainer)

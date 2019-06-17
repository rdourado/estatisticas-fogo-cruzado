/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, number, shape } from 'prop-types'
/**
 * Internal dependencies
 */
import css from './Map.module.css'
import GoogleMap from './GoogleMap'
import Legend from './Legend'

const Map = ({ markers, stats }) => (
	<>
		<div className={css.main}>
			<GoogleMap markers={markers} />
		</div>
		<Legend stats={stats} />
	</>
)

Map.propTypes = {
	markers: arrayOf(
		shape({
			lat: number,
			lng: number,
		})
	).isRequired,
	stats: shape({
		total: number,
		dead: number,
		injured: number,
		policeTotal: number,
		policeDead: number,
		policeInjured: number,
	}).isRequired,
}

export default Map

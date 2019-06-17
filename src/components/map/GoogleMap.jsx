/* global mapa_fogo_cruzado */
/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, number, shape } from 'prop-types'
import head from 'lodash/head'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap as GMap, Marker } from 'react-google-maps'

const defaultCenter = {
	lat: -13.370406,
	lng: -60.4826743,
}
const icon = {
	url: mapa_fogo_cruzado.pin,
	anchor: { x: 12, y: 34 },
	size: { width: 24, height: 34 },
	scaledSize: { width: 12, height: 17 },
}
const style = { height: '100%' }

const GoogleMap = ({ markers }) => (
	<GMap defaultZoom={12} defaultCenter={defaultCenter} center={head(markers)}>
		{markers.map((position, i) => (
			<Marker key={i} position={position} icon={icon} />
		))}
	</GMap>
)

GoogleMap.propTypes = {
	markers: arrayOf(shape({ lat: number, lng: number })),
}

export default compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${mapa_fogo_cruzado.key}`,
		containerElement: <div style={style} />,
		loadingElement: <div style={style} />,
		mapElement: <div style={style} />,
	}),
	withScriptjs,
	withGoogleMap
)(GoogleMap)

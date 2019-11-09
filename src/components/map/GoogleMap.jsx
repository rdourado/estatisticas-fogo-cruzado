/* global mapa_fogo_cruzado */
import React from 'react'
import { arrayOf, number, shape } from 'prop-types'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap as GMap, Marker } from 'react-google-maps'
import head from 'lodash/head'
import styled from 'styled-components'

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

const GoogleMap = props => (
	<GMap defaultZoom={12} defaultCenter={defaultCenter} center={head(props.markers)}>
		{props.markers.map((position, index) => (
			<Marker key={index} position={position} icon={icon} />
		))}
	</GMap>
)

GoogleMap.propTypes = {
	markers: arrayOf(shape({ lat: number, lng: number })),
}

const Main = styled.div`
	height: 100%;
`

export default compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${mapa_fogo_cruzado.key}`,
		containerElement: <Main />,
		loadingElement: <Main />,
		mapElement: <Main />,
	}),
	withScriptjs,
	withGoogleMap
)(GoogleMap)

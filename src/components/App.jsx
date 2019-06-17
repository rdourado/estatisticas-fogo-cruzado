/**
 * External dependencies
 */
import React from 'react'
import { bool } from 'prop-types'
import { connect } from 'react-redux'
/**
 * Internal dependencies
 */
import FiltersContainer from './filters'
import GraphicsContainer from './graphics'
import Loading from './dialogs/Loading'
import FatalError from './dialogs/FatalError'
import MapContainer from './map'
import css from './App.module.css'

const App = ({ isLoading, isBroken }) =>
	isLoading ? (
		<Loading />
	) : isBroken ? (
		<FatalError />
	) : (
		<div className={css.app}>
			<FiltersContainer />
			<MapContainer />
			<GraphicsContainer />
		</div>
	)

App.propTypes = {
	isBroken: bool,
	isLoading: bool,
}

const mapStateToProps = ({ state }) => ({
	isBroken: state.isBroken === false,
	isLoading: state.isReady === null,
})

export default connect(mapStateToProps)(App)

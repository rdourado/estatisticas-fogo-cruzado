import React from 'react'
import { bool } from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import FatalError from './dialogs/FatalError'
import Filters from './filters'
import Graphics from './graphics'
import Loading from './dialogs/Loading'
import Map from './map'

const App = props => {
	if (props.isLoading) {
		return <Loading />
	}

	if (props.isBroken) {
		return <FatalError />
	}

	return (
		<>
			<Filters />
			<Map />
			<Graphics />
		</>
	)
}

App.propTypes = {
	isBroken: bool,
	isLoading: bool,
}

const mapStateToProps = ({ state }) => ({
	isBroken: state.isBroken === false,
	isLoading: state.isReady === null,
})

export default compose(
	hot,
	connect(mapStateToProps)
)(App)

import React from 'react'
import { arrayOf, func, shape, string, number } from 'prop-types'
import styled from 'styled-components'
import UFs from './UFs'
import Years from './Years'

const Primary = props => (
	<Main>
		<UFs
			allUFs={props.allUFs}
			currentUF={props.currentUF}
			dispatchSelectUF={props.dispatchSelectUF}
		/>
		<Years
			allYears={props.allYears}
			currentYear={props.currentYear}
			dispatchSelectYear={props.onSelectYear}
		/>
	</Main>
)

Primary.propTypes = {
	allUFs: arrayOf(string).isRequired,
	allYears: arrayOf(
		shape({
			year: number,
			firstDate: number,
			lastDate: number,
		})
	).isRequired,
	currentUF: string.isRequired,
	currentYear: number.isRequired,
	dispatchSelectUF: func.isRequired,
	onSelectYear: func.isRequired,
}

const Main = styled.div`
	align-items: flex-end;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	max-width: 940px;
	padding: 30px 10px 0;
`

export default Primary

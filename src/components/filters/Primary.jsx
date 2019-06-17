/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, func, string, number } from 'prop-types'
/**
 * Internal dependencies
 */
import UFs from './UFs'
import Years from './Years'
import css from './Primary.module.css'

const Primary = ({ allUFs, allYears, currentUF, currentYear, onSelectUF, onSelectYear }) => (
	<div className={css.main}>
		<UFs className={css.ufs} list={allUFs} current={currentUF} onSelect={onSelectUF} />
		<Years
			className={css.years}
			list={allYears}
			current={currentYear}
			onSelect={onSelectYear}
		/>
	</div>
)

Primary.propTypes = {
	allUFs: arrayOf(string).isRequired,
	allYears: arrayOf(number).isRequired,
	currentUF: string.isRequired,
	currentYear: number.isRequired,
	onSelectUF: func.isRequired,
	onSelectYear: func.isRequired,
}

export default Primary

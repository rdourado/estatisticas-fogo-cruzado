/**
 * External dependencies
 */
import React, { Component } from 'react'
import { arrayOf, func, number, string } from 'prop-types'
import classnames from 'classnames'
import clickOutside from 'react-click-outside'
/**
 * Internal dependencies
 */
import css from './Years.module.css'

class Years extends Component {
	state = { isOpen: false }

	handleClickOutside = () => this.setState({ isOpen: false })

	handleToggle = () => this.setState({ isOpen: !this.state.isOpen })

	handleSelect = year => () => {
		this.props.onSelect(year)
		this.handleClickOutside()
	}

	render() {
		const { list, className, current } = this.props
		const { isOpen } = this.state

		return (
			<div className={classnames(css.main, className)}>
				<button type="button" className={css.summary} onClick={this.handleToggle}>
					{current}
				</button>
				<div className={isOpen ? css.details_ : css.details}>
					<div className={css.modal} title="Ano">
						<button type="button" className={css.close} onClick={this.handleToggle}>
							X
						</button>
						<ul className={css.list}>
							{list.map(year => (
								<li key={year} className={css.item}>
									<button
										type="button"
										className={classnames({
											[css.link]: true,
											[css.active]: current === year,
										})}
										onClick={this.handleSelect(year)}
									>
										{year}
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

Years.propTypes = {
	className: string,
	current: number.isRequired,
	list: arrayOf(number).isRequired,
	onSelect: func,
}

export default clickOutside(Years)

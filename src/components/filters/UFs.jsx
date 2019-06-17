/**
 * External dependencies
 */
import React, { Component } from 'react'
import { arrayOf, func, string } from 'prop-types'
import classnames from 'classnames'
import clickOutside from 'react-click-outside'
/**
 * Internal dependencies
 */
import css from './UFs.module.css'

class UFs extends Component {
	state = { isOpen: false }

	handleClickOutside = () => this.setState({ isOpen: false })

	handleToggle = () => this.setState({ isOpen: !this.state.isOpen })

	handleSelect = uf => () => {
		this.props.onSelect(uf)
		this.handleClickOutside()
	}

	render() {
		const { list, className, current } = this.props
		const { isOpen } = this.state

		return (
			<div className={classnames(css.main, className)}>
				<button type="button" className={css.summary} onClick={this.handleToggle}>
					Estado
				</button>
				<div className={isOpen ? css.details_ : css.details}>
					<div className={css.modal} title="Estado">
						<button className={css.close} onClick={this.handleToggle}>
							X
						</button>
						<ul className={css.list}>
							{list.map(uf => (
								<li key={uf} className={css.item}>
									<button
										type="button"
										className={classnames({
											[css.link]: true,
											[css.active]: uf === current,
										})}
										onClick={this.handleSelect(uf)}
									>
										{uf.toUpperCase()}
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

UFs.propTypes = {
	className: string,
	current: string.isRequired,
	list: arrayOf(string).isRequired,
	onSelect: func,
}

export default clickOutside(UFs)

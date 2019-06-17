/**
 * External dependencies
 */
import React, { useState, cloneElement } from 'react'
import { arrayOf, bool, element, func, oneOfType, shape, string } from 'prop-types'
import classnames from 'classnames'
import castArray from 'lodash/castArray'
/**
 * Internal dependencies
 */
import css from './Submenu.module.css'

export const Submenu = ({
	title,
	current,
	options,
	isOpen,
	hideMenu,
	showMenu,
	onSelect,
	label,
	className,
	children,
}) => {
	const [isHover, setStatus] = useState(false)

	const createHover = status => () => setStatus(status)

	const createClick = value => () => {
		hideMenu()
		setStatus(false)
		onSelect(value)
	}

	const mapItem = (item, i) => (
		<li key={i} className={css.item}>
			<button
				className={classnames({
					[css.link]: true,
					[css.active]: castArray(current).indexOf(item.value || item) >= 0,
				})}
				onClick={createClick(item.value || item)}
			>
				{item.label || item || '---'}
			</button>
		</li>
	)

	return (
		<li
			className={classnames({
				[css.mainItem]: true,
				[css.hover]: isHover,
				[css.disabled]: !options.length && !children,
			})}
			onMouseOver={createHover(true)}
			onMouseOut={createHover(false)}
		>
			<button className={css.mainLink} onClick={showMenu}>
				{label || title}
			</button>
			<div
				className={classnames({
					[css.details]: !isOpen,
					[css.details_]: isOpen,
					[className]: className,
				})}
			>
				<div className={css.modal} title={title}>
					<button className={css.close} onClick={hideMenu}>
						X
					</button>
					{children ? (
						cloneElement(children, { hideMenu: createHover(false), onSelect })
					) : (
						<ul className={css.list}>{options.map(mapItem)}</ul>
					)}
				</div>
			</div>
		</li>
	)
}

Submenu.propTypes = {
	title: string.isRequired,
	current: oneOfType([string, arrayOf(string)]),
	options: arrayOf(oneOfType([string, shape({ label: string, value: string })])),
	isOpen: bool.isRequired,
	hideMenu: func.isRequired,
	showMenu: func.isRequired,
	onSelect: func.isRequired,
	label: string,
	className: string,
	children: element,
}
Submenu.defaultProps = {
	options: [],
}

export default Submenu

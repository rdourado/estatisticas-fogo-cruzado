import React, { useState, cloneElement } from 'react'
import { arrayOf, bool, element, func, oneOfType, shape, string } from 'prop-types'
import castArray from 'lodash/castArray'
import styled, { css } from 'styled-components'
import {
	Close,
	Details as DetailsYears,
	Item,
	Link as LinkYears,
	List as ListYears,
	Modal,
} from './Years'
import { breakpoint, rgbGreyLight, rgbOrange, colorOrange } from '../../shared/styles'

export const Submenu = props => {
	const [isHover, setStatus] = useState(false)

	function createHover(status) {
		return () => setStatus(status)
	}

	function createClick(value) {
		return () => {
			props.hideMenu()
			setStatus(false)
			props.onSelect(value)
		}
	}

	function mapItem(item, i) {
		return (
			<Item key={i}>
				<Link
					type="button"
					isactive={castArray(props.current).includes(item.value || item) ? 1 : 0}
					onClick={createClick(item.value || item)}
				>
					{item.label || item || '---'}
				</Link>
			</Item>
		)
	}

	return (
		<Main
			ishover={isHover ? 1 : 0}
			isdisabled={props.options.length === 0 && !props.children ? 1 : 0}
			onMouseOver={createHover(true)}
			onFocus={createHover(true)}
			onMouseOut={createHover(false)}
			onBlur={() => {}}
		>
			<MainLink onClick={props.showMenu}>{props.label || props.title}</MainLink>
			<Details isopen={props.isOpen}>
				<Modal title={props.title}>
					<Close onClick={props.hideMenu}>X</Close>
					{props.children ? (
						cloneElement(props.children, {
							hideMenu: createHover(false),
							onSelect: props.onSelect,
						})
					) : (
						<List>{props.options.map(mapItem)}</List>
					)}
				</Modal>
			</Details>
		</Main>
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

const Main = styled(Item)`
	${({ isdisabled }) =>
		isdisabled === 1 &&
		css`
			opacity: 0.5;
			pointer-events: none;
		`}

	@media (min-width: ${breakpoint}) {
		color: #fff;
		position: relative;
		text-transform: uppercase;

		& + & {
			border: none;
		}

		> div {
			display: ${({ ishover }) => (ishover ? 'block' : 'none')};
		}
	}
`

const Details = styled(DetailsYears)`
	@media (min-width: ${breakpoint}) {
		background: transparent;
		margin: 0;
	}
`

const List = styled(ListYears)`
	@media (min-width: ${breakpoint}) {
		background: #fff;
		box-shadow: 6px 6px 0 0 rgba(${rgbGreyLight}, 0.5);
		max-height: 400px;
		overflow: auto;
		padding: 10px;
		white-space: nowrap;
	}
`

const Link = styled(LinkYears)`
	transition: none;

	@media (min-width: ${breakpoint}) {
		text-align: left;
		width: 100%;

		${({ isactive }) =>
			isactive === 1 &&
			css`
				background: rgba(${rgbOrange}, 0.3);
			`}

		:hover {
			background: ${colorOrange};
			color: #fff;
		}
	}
`

const MainLink = styled(LinkYears)`
	transition: none;

	@media (min-width: ${breakpoint}) {
		background: inherit;
		color: inherit;
		margin: 0 4px 0 0;
		padding: 23px 20px;
		text-transform: uppercase;

		text-align: left;
		width: 100%;

		:hover {
			background: ${colorOrange};
			color: #fff;
		}

		${Main}:hover > & {
			background: #fff;
			color: ${colorOrange};
		}
	}
`

export default Submenu

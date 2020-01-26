import React, { useCallback, useState } from 'react'
import { arrayOf, func, number, shape } from 'prop-types'
import clickOutside from 'click-outside'
import styled from 'styled-components'
import {
	breakpoint,
	colorGreyDark,
	colorGreyLight,
	colorIce,
	colorOrange,
	fontSans,
	rgbGreyLight,
} from '../../shared/styles'

const Years = props => {
	const [isOpen, setStatus] = useState(false)

	const mainRef = useCallback(node => {
		if (node !== null) {
			clickOutside(node, () => setStatus(false))
		}
	}, [])

	function handleToggle() {
		setStatus(!isOpen)
	}

	function handleSelect(year) {
		return () => {
			props.dispatchSelectYear(year)
			setStatus(false)
		}
	}

	return (
		<Main ref={mainRef}>
			<Summary type="button" onClick={handleToggle}>
				{props.currentYear}
			</Summary>
			<Details isopen={isOpen ? 1 : 0}>
				<Modal title="Ano">
					<Close type="button" onClick={handleToggle}>
						X
					</Close>
					<List>
						{props.allYears.map(({ year }) => (
							<Item key={year}>
								<Link
									type="button"
									active={props.currentYear === year}
									onClick={handleSelect(year)}
								>
									{year}
								</Link>
							</Item>
						))}
					</List>
				</Modal>
			</Details>
		</Main>
	)
}

Years.propTypes = {
	allYears: arrayOf(
		shape({
			year: number,
			firstDate: number,
			lastDate: number,
		})
	).isRequired,
	currentYear: number.isRequired,
	dispatchSelectYear: func.isRequired,
}

export const Main = styled.div`
	background: ${colorGreyDark};
	border-radius: 4px;
	box-sizing: border-box;
	color: #fff;
	font: 16px/20px ${fontSans};
	margin: 0 0 35px;
	position: relative;
	text-align: center;

	:before {
		background: ${colorGreyDark};
		border-left: 2px solid rgba(${rgbGreyLight}, 0.15);
		bottom: 3px;
		box-sizing: border-box;
		content: '';
		display: block;
		pointer-events: none;
		position: absolute;
		right: 0;
		top: 3px;
		width: 43px;
	}

	:after {
		border-color: #fff transparent transparent;
		border-style: solid;
		border-width: 8px 6px 0;
		content: '';
		display: block;
		pointer-events: none;
		position: absolute;
		right: 21px;
		top: 50%;
		transform: translate(50%, -50%);
	}

	@media (min-width: ${breakpoint}) {
		margin: 0 10px 18px auto;
		position: relative;
		width: 220px;
		z-index: 10;
	}
`

export const Summary = styled.button`
	&,
	:link,
	:hover,
	:focus,
	:active {
		background: transparent;
		border: none;
		box-sizing: border-box;
		color: inherit;
		cursor: pointer;
		display: block;
		font: inherit;
		outline: none;
		padding: 12px calc(43px + 20px) 12px 20px;
		transition: none;
		width: 100%;
	}
`

export const Details = styled.div`
	background: rgba(0, 0, 0, 0.8);
	box-sizing: border-box;
	bottom: 0;
	display: ${({ isopen }) => (isopen ? 'block' : 'none')};
	left: 0;
	overflow: auto;
	padding: 34px 20px;
	position: fixed;
	right: 0;
	top: 0;
	z-index: 10;

	@media (min-width: ${breakpoint}) {
		background: transparent;
		bottom: auto;
		left: 0;
		margin: 2px 0 0;
		min-width: 100%;
		overflow: visible;
		padding: 0;
		position: absolute;
		right: auto;
		top: 100%;
	}
`

export const Modal = styled.div`
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.75);
	color: ${colorGreyDark};
	font: 20px/1.2 ${fontSans};
	margin: 0 auto;
	max-width: 400px;
	padding: 6px;
	position: relative;

	:before {
		background: ${colorIce};
		color: ${colorOrange};
		content: attr(title);
		display: block;
		padding: 14px;
		text-align: center;
		text-transform: uppercase;
	}

	@media (min-width: ${breakpoint}) {
		background: ${colorGreyLight};
		border-radius: 4px;
		box-shadow: none;
		font: inherit;
		margin: 0;
		max-width: none;
		padding: 0;

		:before {
			display: none;
		}
	}
`

export const Close = styled.button`
	background: #fff;
	border: 2px solid #000;
	border-radius: 50%;
	color: transparent;
	display: block;
	font: 0/0 serif;
	height: 22px;
	margin: 0;
	outline: none;
	padding: 0;
	position: absolute;
	right: -10px;
	top: -10px;
	width: 22px;

	:before,
	:after {
		background: #000;
		bottom: 3px;
		content: '';
		display: block;
		left: calc(50% - 1px);
		position: absolute;
		right: calc(50% - 1px);
		top: 3px;
	}

	:before {
		transform: rotate(45deg);
	}

	:after {
		transform: rotate(-45deg);
	}

	@media (min-width: ${breakpoint}) {
		display: none;
	}
`

export const List = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	padding-top: inherit;

	@media (min-width: ${breakpoint}) {
		padding: 3px;
	}
`

export const Item = styled.li`
	& + & {
		border-top: 1px solid ${colorOrange};

		@media (min-width: ${breakpoint}) {
			border-top: none;
		}
	}
`

export const Link = styled.button`
	background: transparent;
	border: none;
	border-radius: 0;
	box-sizing: border-box;
	display: block;
	font: inherit;
	margin: 0;
	outline: none;
	padding: 19px 10px;
	text-decoration: none;
	transition: none;
	width: 100%;

	&,
	:visited {
		color: inherit;
	}

	:hover,
	:focus,
	:active {
		color: ${colorOrange};
	}

	@media (min-width: ${breakpoint}) {
		padding: 10px;

		:hover,
		:focus,
		:active {
			background: ${colorGreyDark};
			color: #fff;
		}
	}
`

export default Years

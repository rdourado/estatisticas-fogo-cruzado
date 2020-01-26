import React, { useCallback, useState } from 'react'
import { arrayOf, func, string } from 'prop-types'
import clickOutside from 'click-outside'
import styled from 'styled-components'
import { breakpoint, colorGrey, colorOrange, fontSans } from '../../shared/styles'
import {
	Close,
	Details as DetailsYears,
	Item as ItemYears,
	Link as LinkYears,
	List as ListYears,
	Main as MainYears,
	Modal as ModalYears,
	Summary as SummaryYears,
} from './Years'

const UFs = props => {
	const [isOpen, setStatus] = useState(false)

	const mainRef = useCallback(node => {
		if (node !== null) {
			clickOutside(node, handleClickOutside)
		}
	}, [])

	function handleClickOutside() {
		setStatus(false)
	}

	function handleToggle() {
		setStatus(!isOpen)
	}

	function handleSelect(uf) {
		return () => {
			props.dispatchSelectUF(uf)
			handleClickOutside()
		}
	}

	return (
		<Main ref={mainRef}>
			<Summary type="button" onClick={handleToggle}>
				Estado
			</Summary>
			<Details isopen={isOpen ? 1 : 0}>
				<Modal title="Estado">
					<Close onClick={handleToggle}>X</Close>
					<List>
						{props.allUFs.map(uf => (
							<Item key={uf}>
								<Link
									type="button"
									isactive={uf === props.currentUF ? 1 : 0}
									onClick={handleSelect(uf)}
								>
									{uf.toUpperCase()}
								</Link>
							</Item>
						))}
					</List>
				</Modal>
			</Details>
		</Main>
	)
}

UFs.propTypes = {
	allUFs: arrayOf(string).isRequired,
	currentUF: string.isRequired,
	dispatchSelectUF: func,
}

const Main = styled(MainYears)`
	margin: 0 10px;
	width: calc(100% - 20px);

	@media (min-width: ${breakpoint}) {
		background: transparent;
		margin: 0 auto 0 0;
		width: auto;

		:before,
		:after {
			display: none;
		}
	}
`

const Summary = styled(SummaryYears)`
	@media (min-width: ${breakpoint}) {
		display: none;
	}
`

const Details = styled(DetailsYears)`
	@media (min-width: ${breakpoint}) {
		display: block;
		margin: 0;
		position: static;
	}
`

const Modal = styled(ModalYears)`
	@media (min-width: ${breakpoint}) {
		background: transparent;
		font: 18px/24px ${fontSans};
	}
`

const List = styled(ListYears)`
	@media (min-width: ${breakpoint}) {
		display: flex;
		padding: 0;
	}
`

const Item = styled(ItemYears)`
	@media (min-width: ${breakpoint}) {
		margin: 0 3px 0 0;
	}
`

const Link = styled(LinkYears)`
	transition: none;

	@media (min-width: ${breakpoint}) {
		background: ${({ isactive }) => (isactive ? colorOrange : colorGrey)};
		border-radius: 8px 8px 0 0;
		padding: 17px 25px 13px;

		&,
		:link,
		:visited {
			color: #fff;
		}

		:hover,
		:focus {
			background: ${colorOrange};
		}
	}
`

export default UFs

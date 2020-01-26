import React, { useCallback, useState } from 'react'
import { arrayOf, func, number, shape, string } from 'prop-types'
import clickOutside from 'click-outside'
import ReactLoadingBar from 'react-redux-loading-bar'
import styled from 'styled-components'
import {
	Close as CloseYears,
	Details as DetailsYears,
	List as ListYears,
	Main as MainYears,
	Modal as ModalYears,
	Summary as SummaryYears,
} from './Years'
import Calendar from './Calendar'
import Submenu from './Submenu'
import { breakpoint, colorOrange, rgbMetal } from '../../shared/styles'

const Secondary = props => {
	const [isOpen, setStatus] = useState(false)
	const [subOpen, setSubStatus] = useState(0)

	const mainRef = useCallback(node => {
		if (node !== null) {
			clickOutside(node, handleClickOutside)
		}
	}, [])

	function handleClickOutside() {
		setStatus(false)
		setSubStatus(0)
	}

	function handleToggle() {
		setStatus(!isOpen)
	}

	function createHandleSub(subOpen) {
		return () => setSubStatus(subOpen)
	}

	function createHandleSelect(param) {
		return value => {
			props.onSelect(param)(value)
			handleClickOutside()
		}
	}

	return (
		<Main ref={mainRef}>
			<Summary type="button" onClick={handleToggle}>
				Filtre os dados
			</Summary>
			<Details isopen={isOpen ? 1 : 0}>
				<Modal title="Filtre os dados">
					<Close onClick={handleToggle}>X</Close>
					<List>
						<Submenu
							label="Data"
							title="Escolha uma data ou período"
							isOpen={subOpen === 1}
							showMenu={createHandleSub(1)}
							hideMenu={createHandleSub(0)}
							onSelect={createHandleSelect('date')}
						>
							<Calendar
								selectedValue={props.currentDateRange}
								validateDate={props.validateDate}
							/>
						</Submenu>
						<Submenu
							title="Vítimas"
							isOpen={subOpen === 2}
							showMenu={createHandleSub(2)}
							hideMenu={createHandleSub(0)}
							onSelect={createHandleSelect('type')}
							options={props.allTypes}
							current={props.currentType}
						/>
						<Submenu
							title="Região"
							isOpen={subOpen === 3}
							showMenu={createHandleSub(3)}
							hideMenu={createHandleSub(0)}
							onSelect={createHandleSelect('region')}
							options={props.allRegions}
							current={props.currentRegions}
						/>
						<Submenu
							title="Município"
							isOpen={subOpen === 4}
							showMenu={createHandleSub(4)}
							hideMenu={createHandleSub(0)}
							onSelect={createHandleSelect('city')}
							options={props.allCities}
							current={props.currentCities}
						/>
						<Submenu
							title="Bairro"
							isOpen={subOpen === 5}
							showMenu={createHandleSub(5)}
							hideMenu={createHandleSub(0)}
							onSelect={createHandleSelect('nbrhd')}
							options={props.allNBRHDs}
							current={props.currentNBRHDs}
						/>
					</List>
				</Modal>
			</Details>
			<LoadingBar />
		</Main>
	)
}

Secondary.propTypes = {
	allTypes: arrayOf(shape({ label: string, value: string })).isRequired,
	allRegions: arrayOf(string).isRequired,
	allCities: arrayOf(string),
	allNBRHDs: arrayOf(string),
	onSelect: func.isRequired,
	currentDateRange: arrayOf(number).isRequired,
	currentType: string,
	currentRegions: arrayOf(string),
	currentCities: arrayOf(string),
	currentNBRHDs: arrayOf(string),
	validateDate: func,
}

const Main = styled(MainYears)`
	margin: 15px 20px 30px;

	@media (min-width: ${breakpoint}) {
		margin: 0;
		position: relative;
		width: auto
		z-index: 5;

		:before,
		:after {
			display: none;
		}
	}
`

const Summary = styled(SummaryYears)`
	text-align: left;

	@media (min-width: ${breakpoint}) {
		display: none;
	}
`

const Details = styled(DetailsYears)`
	@media (min-width: ${breakpoint}) {
		background: ${colorOrange};
		box-shadow: 0 6px 0 0 rgba(${rgbMetal}, 0.5);
		display: block;
		margin: 0;
		padding: 0;
		position: static;
	}
`

const Modal = styled(ModalYears)`
	@media (min-width: ${breakpoint}) {
		background: transparent;
		border-radius: 0;
		box-shadow: none;
		max-width: none;
		padding: 0;

		:before {
			display: none;
		}
	}
`

const Close = styled(CloseYears)`
	@media (min-width: ${breakpoint}) {
		display: none;
	}
`

const List = styled(ListYears)`
	@media (min-width: ${breakpoint}) {
		display: flex;
		margin: 0 auto;
		max-width: 940px;
		padding: 0 10px;
	}
`

const LoadingBar = styled(ReactLoadingBar)`
	background-color: white;
	height: 5px;
	position: absolute;
`

export default Secondary

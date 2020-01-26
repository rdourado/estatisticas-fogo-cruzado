/* eslint-disable react/display-name */
import React, { useReducer, useEffect } from 'react'
import { arrayOf, func, number } from 'prop-types'
import moment from 'moment'
import styled, { css } from 'styled-components'
import times from 'lodash/times'
import {
	breakpoint,
	colorIce,
	colorOrange,
	fontSans,
	rgbGreyLight,
	rgbOrange,
} from '../../shared/styles'

moment.locale('pt-br')

const DATE_FORMAT = 'DD/MM/YYYY'
const now = moment()
const before = moment().add(-1, 'month')

const initialState = {
	hoverDate: null,
	isPicking: false,
	months: [before, now],
	selectedValue: [before, now],
}

const sortDates = (dates = []) =>
	dates.sort((a, b) => {
		if (a.isAfter(b, 'day')) return 1
		return a.isBefore(b, 'day') ? -1 : 0
	})

function stateReducer(prevState, nextState) {
	return { ...prevState, ...nextState }
}

const Calendar = props => {
	const [state, setState] = useReducer(stateReducer, initialState)

	useEffect(() => {
		const initialValue = props.selectedValue.map(moment.unix)
		setState({ months: initialValue, selectedValue: initialValue })
	}, [props.selectedValue])

	function updateMonth(cal = 0, dir = 1) {
		return () => {
			const months = state.months.map((date, index) =>
				index === cal ? moment(date).add(dir, 'M') : date
			)

			setState({ months })
		}
	}

	function selectDate(date) {
		return () => {
			setState({
				isPicking: !state.isPicking,
				selectedValue: sortDates([!state.isPicking ? date : state.selectedValue[0], date]),
				hoverDate: !state.isPicking ? date : null,
			})
		}
	}

	function setHoverDate(hoverDate) {
		return () => {
			if (state.isPicking) {
				setState({ hoverDate })
			}
		}
	}

	function renderHeader(cal = 0) {
		return (
			<caption>
				<Header>
					<Prev type="button" onClick={updateMonth(cal, -1)}>
						«
					</Prev>
					<Month>{state.months[cal].format('MMMM - YYYY')}</Month>
					<Next type="button" onClick={updateMonth(cal, 1)}>
						»
					</Next>
				</Header>
			</caption>
		)
	}

	function renderWeekDays() {
		return (
			<thead>
				<tr>{times(7, renderWeekDay)}</tr>
			</thead>
		)
	}

	function renderWeekDay(weekday) {
		const day = moment().weekday(weekday)

		return (
			<WeekdayName key={day.format('ddd')} scope="col">
				{day.format('ddd').substr(0, 1)}
			</WeekdayName>
		)
	}

	function renderDate(firstWeekDay, cal = 0) {
		return count => {
			const day = moment(firstWeekDay).add(count, 'day')
			const month = state.months[cal]
			const [firstDate, lastDate] = sortDates([
				state.selectedValue[0],
				state.hoverDate || state.selectedValue[1],
			])

			return (
				<Day
					key={day.unix()}
					istoday={day.isSame(moment(), 'day') ? 1 : 0}
					isinrange={day.isBetween(firstDate, lastDate) ? 1 : 0}
					isfirstday={day.isSame(firstDate, 'day') ? 1 : 0}
					islastday={day.isSame(lastDate, 'day') ? 1 : 0}
					isout={!day.isSame(month, 'M') ? 1 : 0}
					isinvalid={!props.validateDate(day) ? 1 : 0}
				>
					<CellButton
						type="button"
						onMouseOver={setHoverDate(day)}
						onFocus={setHoverDate(day)}
						onClick={selectDate(day)}
					>
						{day.format('D')}
					</CellButton>
				</Day>
			)
		}
	}

	function renderWeek(firstDay, cal = 0) {
		return count => {
			const firstWeekDay = moment(firstDay).add(count, 'week')

			return <tr key={firstWeekDay.valueOf()}>{times(7, renderDate(firstWeekDay, cal))}</tr>
		}
	}

	function renderWeeks(cal = 0) {
		const firstDay = moment(state.months[cal])
			.startOf('M')
			.weekday(0)

		return <tbody>{times(6, renderWeek(firstDay, cal))}</tbody>
	}

	function renderValues() {
		const [firstDate, lastDate] = state.selectedValue

		return (
			<Values>
				<FirstValue type="text" value={firstDate.format(DATE_FORMAT)} readOnly />
				<LastValue type="text" value={lastDate.format(DATE_FORMAT)} readOnly />
			</Values>
		)
	}

	function handleSubmit(event) {
		event.preventDefault()
		props.onSelect(state.selectedValue.map(date => date.unix()))
		props.hideMenu()
	}

	return (
		<Main onSubmit={handleSubmit}>
			{renderValues()}
			{times(state.months.length, m => (
				<CalendarTable key={m}>
					{renderHeader(m)}
					{renderWeekDays()}
					{renderWeeks(m)}
				</CalendarTable>
			))}
			<Footer>
				<Button type="submit" disabled={state.isPicking}>
					Aplicar
				</Button>
			</Footer>
		</Main>
	)
}

Calendar.displayName = 'Calendar'
Calendar.propTypes = {
	hideMenu: func,
	onSelect: func,
	selectedValue: arrayOf(number),
	validateDate: func,
}
Calendar.defaultProps = {
	selectedValue: [before, now],
}

const Header = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	text-transform: none;

	@media (min-width: ${breakpoint}) {
		justify-content: space-between;
	}
`

const Prev = styled.button`
	background: transparent;
	border: none;
	font: 0 / 0 serif;
	margin: 0;
	outline: none;
	padding: 5px 10px;

	:before {
		border-right: 3px solid #000;
		border-top: 3px solid #000;
		content: '';
		display: inline-block;
		padding: 3px;
		transform: rotate(-135deg);
	}

	:hover,
	:focus {
		background: transparent;
	}
`

const Next = styled(Prev)`
	:before {
		transform: rotate(45deg);
	}
`

const Month = styled.strong`
	font: inherit;
	margin: 0 10px;
`

const WeekdayName = styled.th`
	background: ${colorIce};
	background-clip: padding-box;
	border: none;
	border-bottom: 10px solid transparent;
	border-top: 10px solid transparent;
	cursor: default;
	font: inherit;
	padding: 0.5em;
`

const Day = styled.td`
	background-clip: padding-box;
	border: none;
	border-bottom: 10px solid transparent;
	border-top: 10px solid transparent;
	cursor: pointer;
	font: inherit;
	padding: 0.35em 0.5em;

	${({ istoday }) =>
		istoday === 1 &&
		css`
			color: ${colorOrange};
			font-weight: 700;
		`}

	${({ isinrange }) =>
		isinrange === 1 &&
		css`
			background-color: rgba(${rgbOrange}, 0.3);
		`}

	${({ isfirstday, islastday }) =>
		(isfirstday === 1 || islastday === 1) &&
		css`
			background-color: ${colorOrange};
			color: #fff;
		`}

	${({ isout }) =>
		isout === 1 &&
		css`
			visibility: hidden;
		`}

	${({ isinvalid }) =>
		isinvalid === 1 &&
		css`
			cursor: not-allowed;
			opacity: 0.3;
			pointer-events: none;
		`}
`

const CellButton = styled.button`
	&,
	:hover,
	:focus {
		background: transparent;
		border: none;
		box-sizing: border-box;
		color: inherit;
		font: inherit;
		height: 100%;
		margin: 0;
		outline: none;
		padding: 0;
		width: 100%;
	}
`

const Values = styled.div`
	box-sizing: border-box;
	display: flex;
	font: inherit;
	justify-content: space-between;
	margin: 0 auto 20px;
	width: calc(100% - 20px);

	@media (min-width: ${breakpoint}) {
		display: none;
	}
`

const FirstValue = styled.input`
	background: ${colorIce};
	border: none;
	border-radius: 5px;
	box-sizing: border-box;
	display: block;
	font: inherit;
	margin: 0;
	padding: 0.7em;
	text-align: center;
	width: calc(50% - 5px);
`

const LastValue = styled(FirstValue)``

const Main = styled.form`
	font: 15px ${fontSans};

	@media (min-width: ${breakpoint}) {
		background: #fff;
		box-shadow: 6px 6px 0 0 rgba(${rgbGreyLight}, 0.5);
		display: grid;
		font-size: 20px;
		gap: 0 60px;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		padding: 60px 30px 0;
	}
`

const CalendarTable = styled.table`
	border: none;
	border-collapse: collapse;
	border-spacing: 0;
	box-sizing: border-box;
	font: inherit;
	margin: 0 auto;
	padding: 0;
	text-align: center;
	user-select: none;
	white-space: nowrap;
	width: calc(100% - 20px);

	& ~ & {
		display: none;
	}

	@media (min-width: ${breakpoint}) {
		width: auto;

		& ~ & {
			display: table;
		}
	}
`

const Footer = styled.div`
	background: ${colorIce};
	border-radius: 0 0 8px 8px;
	margin: 20px -6px -6px;
	padding: 20px 0;

	@media (min-width: ${breakpoint}) {
		grid-column: span 2;
		margin: 0 -30px;
		width: auto;
	}
`

const Button = styled.button`
	&,
	:link,
	:hover,
	:focus,
	:active {
		background: ${colorOrange};
		border: none;
		border-radius: 4px;
		box-sizing: border-box;
		color: #fff;
		display: block;
		font: inherit;
		margin: 0 auto;
		max-width: 260px;
		padding: 1em 0.5em;
		width: 100%;
	}

	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
		pointer-events: none;
	}
`

export default Calendar

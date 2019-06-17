/**
 * External dependencies
 */
import React, { Component } from 'react'
import { arrayOf, func, number } from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'
import times from 'lodash/times'
/**
 * Internal dependencies
 */
import css from './Calendar.module.css'

moment.locale('pt-br')

const sortDates = (dates = []) =>
	dates.sort((a, b) => {
		if (a.isAfter(b, 'day')) return 1
		return a.isBefore(b, 'day') ? -1 : 0
	})

class Calendar extends Component {
	state = {
		hoverDate: null,
		isPicking: false,
		months: this.props.selectedValue.map(moment.unix),
		selectedValue: this.props.selectedValue.map(moment.unix),
	}

	componentDidUpdate(prevProps) {
		const [prevStart, prevEnd] = prevProps.selectedValue.map(moment.unix)
		const [start, end] = this.props.selectedValue.map(moment.unix)

		if (!prevStart.isSame(start, 'day') || !prevEnd.isSame(end, 'day')) {
			this.setState({
				months: start.isSame(end, 'month')
					? [start, moment(end).add(1, 'month')]
					: [start, end],
				selectedValue: [start, end],
			})
		}
	}

	updateMonth = (cal = 0, dir = 1) => () => {
		const { months: state } = this.state
		const newMonth = moment(state[cal]).add(dir, 'M')
		const diff = dir / Math.abs(dir)
		const nextMonth = state[cal + diff]

		let callback = () => {}
		if (nextMonth && moment(nextMonth).isSame(newMonth, 'M')) {
			callback = this.updateMonth(cal + diff, diff)
		}
		const months = state.map((m, i) => (i === cal ? moment(m).add(dir, 'M') : m))

		this.setState({ months }, callback)
	}

	selectDate = date => () => {
		const {
			isPicking,
			selectedValue: [first],
		} = this.state

		this.setState({
			isPicking: !isPicking,
			selectedValue: sortDates([!isPicking ? date : first, date]),
			hoverDate: !isPicking ? date : null,
		})
	}

	setHoverDate = hoverDate => () => {
		const { isPicking } = this.state

		if (isPicking) {
			this.setState({ hoverDate })
		}
	}

	renderHeader = (cal = 0) => {
		const { months } = this.state

		return (
			<caption>
				<div className={css.header}>
					<button type="button" className={css.prev} onClick={this.updateMonth(cal, -1)}>
						«
					</button>
					<strong className={css.month}>{months[cal].format('MMMM - YYYY')}</strong>
					<button type="button" className={css.next} onClick={this.updateMonth(cal, 1)}>
						»
					</button>
				</div>
			</caption>
		)
	}

	renderWeekDays = () => (
		<thead>
			<tr>{times(7, this.renderWeekDay)}</tr>
		</thead>
	)

	renderWeekDay = weekday => {
		const day = moment().weekday(weekday)

		return (
			<th key={day.format('ddd')} scope="col" className={css.weekdayname}>
				{day.format('ddd').substr(0, 1)}
			</th>
		)
	}

	renderWeeks = (cal = 0) => {
		const { months } = this.state
		const firstDay = moment(months[cal])
			.startOf('M')
			.weekday(0)

		return <tbody>{times(6, this.renderWeek(firstDay, cal))}</tbody>
	}

	renderWeek = (firstDay, cal = 0) => count => {
		const firstWeekDay = moment(firstDay).add(count, 'week')

		return <tr key={firstWeekDay.valueOf()}>{times(7, this.renderDate(firstWeekDay, cal))}</tr>
	}

	renderDate = (firstWeekDay, cal = 0) => count => {
		const {
			months,
			hoverDate,
			selectedValue: [first, last],
		} = this.state
		const { validateDate } = this.props
		const day = moment(firstWeekDay).add(count, 'day')
		const month = months[cal]
		const [firstDate, lastDate] = sortDates([first, hoverDate || last])

		return (
			<td
				key={day.unix()}
				className={classnames({
					[css.day]: true,
					[css.today]: day.isSame(moment(), 'day'),
					[css.inrange]: day.isBetween(firstDate, lastDate),
					[css.firstday]: day.isSame(firstDate, 'day'),
					[css.lastday]: day.isSame(lastDate, 'day'),
					[css.out]: !day.isSame(month, 'M'),
					[css.invalid]: !validateDate(day),
				})}
			>
				<button
					type="button"
					className={css.cell_btn}
					onMouseOver={this.setHoverDate(day)}
					onFocus={this.setHoverDate(day)}
					onClick={this.selectDate(day)}
				>
					{day.format('D')}
				</button>
			</td>
		)
	}

	renderValues = () => {
		const {
			selectedValue: [first, last],
		} = this.state

		return (
			<div className={css.values}>
				<input
					className={css.firstValue}
					type="text"
					value={first.format('DD/MM/YYYY')}
					readOnly
				/>
				<input
					className={css.lastValue}
					type="text"
					value={last.format('DD/MM/YYYY')}
					readOnly
				/>
			</div>
		)
	}

	handleSubmit = event => {
		const {
			selectedValue: [first, last],
		} = this.state
		const { hideMenu, onSelect } = this.props

		event.preventDefault()
		onSelect([first.unix(), last.unix()])
		hideMenu()
	}

	render() {
		const { months, isPicking } = this.state

		return (
			<form className={css.main} onSubmit={this.handleSubmit}>
				{this.renderValues()}
				{times(months.length, m => (
					<table key={m} className={css.calendar}>
						{this.renderHeader(m)}
						{this.renderWeekDays()}
						{this.renderWeeks(m)}
					</table>
				))}
				<div className={css.footer}>
					<button type="submit" className={css.button} disabled={isPicking}>
						Aplicar
					</button>
				</div>
			</form>
		)
	}
}

Calendar.propTypes = {
	hideMenu: func,
	onSelect: func,
	selectedValue: arrayOf(number),
	validateDate: func,
}
Calendar.defaultProps = {
	hideMenu: () => {},
	onSelect: () => {},
	selectedValue: [
		moment()
			.add(-1, 'month')
			.unix(),
		moment().unix(),
	],
	validateDate: () => true,
}

export default Calendar

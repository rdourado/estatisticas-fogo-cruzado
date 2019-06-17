/**
 * External dependencies
 */
import React, { Component } from 'react'
import { arrayOf, func, number, shape, string } from 'prop-types'
import classnames from 'classnames'
import clickOutside from 'react-click-outside'
import LoadingBar from 'react-redux-loading-bar'
/**
 * Internal dependencies
 */
import Calendar from './Calendar'
import Submenu from './Submenu'
import css from './Secondary.module.css'

class Secondary extends Component {
	state = { isOpen: false, subOpen: 0 }

	handleClickOutside = () => this.setState({ isOpen: false, subOpen: 0 })

	handleToggle = () => this.setState({ isOpen: !this.state.isOpen })

	handleSub = subOpen => () => this.setState({ subOpen })

	handleSelect = param => value => {
		this.props.onSelect(param)(value)
		this.handleClickOutside()
	}

	render() {
		const { className } = this.props
		const { isOpen, subOpen } = this.state

		return (
			<div className={classnames(css.main, className)}>
				<button type="button" className={css.summary} onClick={this.handleToggle}>
					Filtre os dados
				</button>
				<div className={isOpen ? css.details_ : css.details}>
					<div className={css.modal} title="Filtre os dados">
						<button className={css.close} onClick={this.handleToggle}>
							X
						</button>
						<ul className={css.list}>
							<Submenu
								label="Data"
								title="Escolha uma data ou período"
								className={css.submenu}
								isOpen={subOpen === 1}
								showMenu={this.handleSub(1)}
								hideMenu={this.handleSub(0)}
								onSelect={this.handleSelect('date')}
							>
								<Calendar
									selectedValue={this.props.currentDateRange}
									validateDate={this.props.validateDate}
								/>
							</Submenu>
							<Submenu
								title="Vítimas"
								isOpen={subOpen === 2}
								showMenu={this.handleSub(2)}
								hideMenu={this.handleSub(0)}
								onSelect={this.handleSelect('type')}
								options={this.props.allTypes}
								current={this.props.currentType}
							/>
							<Submenu
								title="Região"
								isOpen={subOpen === 3}
								showMenu={this.handleSub(3)}
								hideMenu={this.handleSub(0)}
								onSelect={this.handleSelect('region')}
								options={this.props.allRegions}
								current={this.props.currentRegion}
							/>
							<Submenu
								title="Município"
								isOpen={subOpen === 4}
								showMenu={this.handleSub(4)}
								hideMenu={this.handleSub(0)}
								onSelect={this.handleSelect('city')}
								options={this.props.allCities}
								current={this.props.currentCities}
							/>
							<Submenu
								title="Bairro"
								isOpen={subOpen === 5}
								showMenu={this.handleSub(5)}
								hideMenu={this.handleSub(0)}
								onSelect={this.handleSelect('nbrhd')}
								options={this.props.allNBRHDs}
								current={this.props.currentNBRHDs}
							/>
						</ul>
					</div>
				</div>
				<LoadingBar className={css.loadingbar} />
			</div>
		)
	}
}

Secondary.propTypes = {
	allTypes: arrayOf(shape({ label: string, value: string })).isRequired,
	allRegions: arrayOf(string).isRequired,
	allCities: arrayOf(string),
	allNBRHDs: arrayOf(string),
	onSelect: func.isRequired,
	currentDateRange: arrayOf(number).isRequired,
	currentType: string,
	currentRegion: string,
	currentCities: arrayOf(string),
	currentNBRHDs: arrayOf(string),
	validateDate: func,
	className: string,
}

export default clickOutside(Secondary)

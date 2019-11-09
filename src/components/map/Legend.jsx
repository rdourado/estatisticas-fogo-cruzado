import React from 'react'
import { number, shape } from 'prop-types'
import parseInt from 'lodash/parseInt'
import styled from 'styled-components'
import {
	breakpoint,
	colorGreyDark,
	colorGreyLight,
	colorOrange,
	fontSans,
	rgbGreyDark,
} from '../../shared/styles'

const maybePluralize = (singular, plural, count) => (parseInt(count) !== 1 ? plural : singular)

const Legend = props => (
	<Wrap>
		<Main>
			<List>
				<Item>
					<Icon />
					<Value>{props.stats.shootings}</Value>
					<Label>{maybePluralize('Tiroteio', 'Tiroteios', props.stats.shootings)}</Label>
				</Item>
				<Item>
					<Icon />
					<Value>{props.stats.policeTotal}</Value>
					<Label>Presença de agentes</Label>
				</Item>
			</List>
			<List>
				<Item>
					<Icon />
					<Value>{props.stats.peopleDead}</Value>
					<Label>{maybePluralize('Morto', 'Mortos', props.stats.peopleDead)}</Label>
				</Item>
				<Item>
					<Icon />
					<Value>{props.stats.peopleHurt}</Value>
					<Label>{maybePluralize('Ferido', 'Feridos', props.stats.peopleHurt)}</Label>
				</Item>
			</List>
			<List>
				<Item>
					<Icon />
					<Value>{props.stats.policeDead}</Value>
					<Label>
						{maybePluralize('Agente morto', 'Agentes mortos', props.stats.policeDead)}
					</Label>
				</Item>
				<Item>
					<Icon />
					<Value>{props.stats.policeHurt}</Value>
					<Label>
						{maybePluralize('Agente ferido', 'Agentes feridos', props.stats.policeHurt)}
					</Label>
				</Item>
			</List>
		</Main>
	</Wrap>
)

Legend.propTypes = {
	stats: shape({
		peopleDead: number,
		peopleHurt: number,
		policeDead: number,
		policeHurt: number,
		policeTotal: number,
		shootings: number,
	}).isRequired,
}

const Wrap = styled.div`
	background: rgba(${rgbGreyDark}, 0.9);
`

const Main = styled.div`
	justify-content: space-around;
	margin: 0 auto;
	max-width: 940px;
	padding: 10px;

	@media (min-width: ${breakpoint}) {
		display: flex;
		flex-wrap: wrap;
	}
`

const List = styled.ul`
	display: flex;
	font: 12px ${fontSans};
	list-style: none;
	margin: 0;
	padding: 0;

	@media (min-width: ${breakpoint}) {
		display: block;
		font-size: 16px;
	}
`

const Item = styled.li`
	align-items: center;
	display: flex;
	padding: 4px 0;
	position: relative;
	width: 50%;

	@media (min-width: ${breakpoint}) {
		width: auto;
	}
`

const Icon = styled.i`
	background: ${colorOrange};
	border-radius: 50%;
	display: inline-block;
	height: 1em;
	margin: 0 0.5em 0 0;
	position: relative;
	width: 1em;

	:before {
		border-right: 1px solid ${colorGreyDark};
		border-top: 1px solid ${colorGreyDark};
		box-sizing: border-box;
		content: '';
		display: block;
		left: 0.48em;
		margin: -0.187em -0.25em;
		padding: 0.187em;
		position: absolute;
		top: 0.5em;
		transform: rotate(45deg);
	}
`

const Value = styled.strong`
	color: ${colorGreyLight};
	font: inherit;
	min-width: 2.5em;
	text-align: right;
`

const Label = styled.span`
	color: #fff;
	font: inherit;
	margin-left: 0.5em;
`

export default Legend

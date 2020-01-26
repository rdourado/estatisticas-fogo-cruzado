import React from 'react'
import { arrayOf, func, number, shape, string } from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'
import { colorIce, colorMetal, colorOrange, fontSans } from '../../shared/styles'

const DATE_FORMAT = 'DD/MM/YYYY'

const CurrentFilters = props => (
	<Main>
		<Wrap>
			<Title>Filtros:</Title>
			<List>
				{!!props.currentDateRange && (
					<Item>
						<FakeButton>
							{moment.unix(props.currentDateRange[0]).format(DATE_FORMAT)} a{' '}
							{moment.unix(props.currentDateRange[1]).format(DATE_FORMAT)}
						</FakeButton>
					</Item>
				)}

				{!!props.currentType && (
					<Item>
						<Button
							as="button"
							type="button"
							onClick={() => props.onSelect('type')(props.currentType)}
						>
							<Icon />
							{props.allTypes.find(x => x.value === props.currentType).label}
						</Button>
					</Item>
				)}

				{!!props.currentRegions &&
					props.currentRegions.map((region, i) => (
						<Item key={`${region}-${i}`}>
							<Button as="button" onClick={() => props.onSelect('region')(region)}>
								<Icon />
								{region}
							</Button>
						</Item>
					))}

				{!!props.currentCities &&
					props.currentCities.map((city, i) => (
						<Item key={`${city}-${i}`}>
							<Button as="button" onClick={() => props.onSelect('city')(city)}>
								<Icon />
								{city}
							</Button>
						</Item>
					))}

				{!!props.currentNBRHDs &&
					props.currentNBRHDs.map((nbrhd, i) => (
						<Item key={`${nbrhd}-${i}`}>
							<Button as="button" onClick={() => props.onSelect('nbrhd')(nbrhd)}>
								<Icon />
								{nbrhd}
							</Button>
						</Item>
					))}
			</List>
		</Wrap>
	</Main>
)

CurrentFilters.propTypes = {
	allTypes: arrayOf(shape({ label: string, value: string })),
	currentDateRange: arrayOf(number),
	currentType: string,
	currentRegions: arrayOf(string),
	currentCities: arrayOf(string),
	currentNBRHDs: arrayOf(string),
	onSelect: func,
}

const Main = styled.section`
	background: ${colorIce};
`

const Wrap = styled.div`
	align-items: center;
	display: flex;
	margin: 0 auto;
	max-width: 940px;
	padding: 10px;
`

const Title = styled.h4`
	color: ${colorOrange};
	font: 16px ${fontSans};
	margin: 0;
	padding: 0;

	:before {
		display: none !important;
	}
`

const List = styled.ul`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	list-style: none;
	margin: 0;
	padding: 0;
`

const Item = styled.li`
	font: 0 / 0 serif;
`

const Icon = styled.i`
	background: ${colorOrange};
	border-radius: 50%;
	display: inline-block;
	height: 1.0625em;
	margin: 0 0.4em 0 0;
	position: relative;
	transform: rotate(45deg);
	width: 1.0625em;

	:before,
	:after {
		border-top: 1px solid ${colorIce};
		content: '';
		display: block;
		left: 0.2em;
		right: 0.2em;
		position: absolute;
		top: 0.5em;
	}

	:before {
		transform: rotate(90deg);
	}
`

const FakeButton = styled.span`
	align-items: center;
	background: transparent;
	border: none;
	border-radius: 0;
	color: ${colorMetal};
	display: flex;
	font: 16px ${fontSans};
	margin: 2px 0 2px 15px;
	padding: 0;
`

const Button = styled(FakeButton)`
	:hover,
	:focus {
		background: transparent;
		color: ${colorOrange};
	}
`

export default CurrentFilters

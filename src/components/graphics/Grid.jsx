import React from 'react'
import { arrayOf, func, number, object, shape, string } from 'prop-types'
import styled from 'styled-components'
import { breakpoint, colorOrange, fontSans } from '../../shared/styles'
import Graphic from './Graphic'

const Grid = ({
	agentDeathsByMonth,
	agentHurtsByMonth,
	filters,
	currentDateRange,
	deathsByCities,
	deathsByMonth,
	deathsByNBRHDs,
	deathsByRegions,
	deathsByUPPs,
	graphics,
	injuresByCities,
	injuresByMonth,
	injuresByNBRHDs,
	injuresByRegions,
	injuresByUPPs,
	massacresByCities,
	requestImage,
	shootingsByCities,
	shootingsByMonth,
	shootingsByNBRHDs,
	shootingsByRegions,
	shootingsByUPPs,
}) => {
	const props = { filters, graphics, requestImage, dateRange: currentDateRange }

	return (
		<>
			<Title>Estatísticas</Title>
			<StyledGrid>
				{/* MÊS */}

				{!!shootingsByMonth.data && shootingsByMonth.data.length > 0 && (
					<Graphic title="Tiroteios Por Mês" {...shootingsByMonth} {...props} />
				)}
				{!!deathsByMonth.data && deathsByMonth.data.length > 0 && (
					<Graphic title="Mortos Por Mês" {...deathsByMonth} {...props} />
				)}
				{!!injuresByMonth.data && injuresByMonth.data.length > 0 && (
					<Graphic title="Feridos Por Mês" {...injuresByMonth} {...props} />
				)}

				{/* REGIÃO */}

				{!!shootingsByRegions.data && shootingsByRegions.data.length > 0 && (
					<Graphic title="Tiroteios Por Região" {...shootingsByRegions} {...props} />
				)}
				{!!deathsByRegions.data && deathsByRegions.data.length > 0 && (
					<Graphic title="Mortos Por Região" {...deathsByRegions} {...props} />
				)}
				{!!injuresByRegions.data && injuresByRegions.data.length > 0 && (
					<Graphic title="Feridos Por Região" {...injuresByRegions} {...props} />
				)}

				{/* MUNICÍPIOS */}

				{!!shootingsByCities.data && shootingsByCities.data.length > 0 && (
					<Graphic title="Tiroteios Por Município" {...shootingsByCities} {...props} />
				)}
				{!!deathsByCities.data && deathsByCities.data.length > 0 && (
					<Graphic title="Mortos Por Município" {...deathsByCities} {...props} />
				)}
				{!!injuresByCities.data && injuresByCities.data.length > 0 && (
					<Graphic title="Feridos Por Município" {...injuresByCities} {...props} />
				)}

				{/* BAIRROS */}

				{!!shootingsByNBRHDs.data && shootingsByNBRHDs.data.length > 0 && (
					<Graphic title="Tiroteios Por Bairro" {...shootingsByNBRHDs} {...props} />
				)}
				{!!deathsByNBRHDs.data && deathsByNBRHDs.data.length > 0 && (
					<Graphic title="Mortos Por Bairro" {...deathsByNBRHDs} {...props} />
				)}
				{!!injuresByNBRHDs.data && injuresByNBRHDs.data.length > 0 && (
					<Graphic title="Feridos Por Bairro" {...injuresByNBRHDs} {...props} />
				)}

				{/* UPP */}

				{!!shootingsByUPPs.data && shootingsByUPPs.data.length > 0 && (
					<Graphic title="Tiroteios em áreas de UPP" {...shootingsByUPPs} {...props} />
				)}
				{!!deathsByUPPs.data && deathsByUPPs.data.length > 0 && (
					<Graphic title="Mortos em áreas de UPP" {...deathsByUPPs} {...props} />
				)}
				{!!injuresByUPPs.data && injuresByUPPs.data.length > 0 && (
					<Graphic title="Feridos em áreas de UPP" {...injuresByUPPs} {...props} />
				)}

				{/* OUTROS */}

				{!!agentDeathsByMonth.data && agentDeathsByMonth.data.length > 0 && (
					<Graphic title="Agentes Mortos Por Mês" {...agentDeathsByMonth} {...props} />
				)}
				{!!agentHurtsByMonth.data && agentHurtsByMonth.data.length > 0 && (
					<Graphic title="Agentes Feridos Por Mês" {...agentHurtsByMonth} {...props} />
				)}
				{!!massacresByCities.data && massacresByCities.data.length > 0 && (
					<Graphic title="Chacinas Por Município" {...massacresByCities} {...props} />
				)}
			</StyledGrid>
		</>
	)
}

Grid.propTypes = {
	agentDeathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentHurtsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	currentDateRange: arrayOf(number).isRequired,
	deathsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	filters: object,
	graphics: object,
	injuresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	massacresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	requestImage: func,
	shootingsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByUPPs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
}

const Title = styled.h2`
	color: ${colorOrange};
	font: 700 26px ${fontSans};
	margin: 60px auto;
	padding: 0;
	text-align: center;
	text-transform: uppercase;

	:before {
		display: none !important;
	}
`

const StyledGrid = styled.div`
	margin: 0 10px;

	@media (min-width: ${breakpoint}) {
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;
		max-width: 940px;
		padding: 0 10px;
	}
`

export default Grid

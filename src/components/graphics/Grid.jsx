/**
 * External dependencies
 */
import React from 'react'
import { arrayOf, func, number, object, shape, string } from 'prop-types'
/**
 * Internal dependencies
 */
import Graphic from './Graphic'
import css from './Grid.module.css'

const Grid = ({
	agentDeathsByMonth,
	agentInjuresByMonth,
	deathsByCities,
	deathsByMonth,
	deathsByNBRHDs,
	deathsByRegions,
	graphics,
	hasChanged,
	injuresByCities,
	injuresByMonth,
	injuresByNBRHDs,
	injuresByRegions,
	requestImage,
	shootingsByCities,
	shootingsByMonth,
	shootingsByNBRHDs,
	shootingsByRegions,
}) => {
	const _props = { requestImage, graphics, hasChanged }

	return (
		<>
			<h2 className={css.title}>Gráficos</h2>
			<div className={css.grid}>
				{!!shootingsByCities.data && (
					<Graphic
						title="Tiroteios Por Município"
						subtitle={`(${shootingsByCities.data.length} primeiros) / tiroteios`}
						{...shootingsByCities}
						{..._props}
					/>
				)}
				{!!deathsByCities.data && (
					<Graphic
						title="Mortos Por Município"
						subtitle={`(${deathsByCities.data.length} primeiros) / mortos`}
						{...deathsByCities}
						{..._props}
					/>
				)}
				{!!deathsByCities.data && (
					<Graphic
						title="Feridos Por Município"
						subtitle={`(${deathsByCities.data.length} primeiros) / feridos`}
						{...injuresByCities}
						{..._props}
					/>
				)}

				{!!shootingsByNBRHDs.data && (
					<Graphic
						title="Tiroteios Por Bairro"
						subtitle={`(${shootingsByNBRHDs.data.length} primeiros) / tiroteios`}
						{...shootingsByNBRHDs}
						{..._props}
					/>
				)}
				{!!deathsByNBRHDs.data && (
					<Graphic
						title="Mortos Por Bairro"
						subtitle={`(${deathsByNBRHDs.data.length} primeiros) / mortos`}
						{...deathsByNBRHDs}
						{..._props}
					/>
				)}
				{!!deathsByNBRHDs.data && (
					<Graphic
						title="Feridos Por Bairro"
						subtitle={`(${deathsByNBRHDs.data.length} primeiros) / feridos`}
						{...injuresByNBRHDs}
						{..._props}
					/>
				)}

				{!!shootingsByMonth.data && (
					<Graphic
						title="Tiroteios Por Mês"
						subtitle={`(${shootingsByMonth.data.length} meses) / tiroteios`}
						{...shootingsByMonth}
						{..._props}
					/>
				)}
				{!!deathsByMonth.data && (
					<Graphic
						title="Mortos Por Mês"
						subtitle={`(${deathsByMonth.data.length} meses) / mortos`}
						{...deathsByMonth}
						{..._props}
					/>
				)}
				{!!injuresByMonth.data && (
					<Graphic
						title="Feridos Por Mês"
						subtitle={`(${injuresByMonth.data.length} meses) / feridos`}
						{...injuresByMonth}
						{..._props}
					/>
				)}

				{!!shootingsByRegions.data && (
					<Graphic
						title="Tiroteios Por Região"
						subtitle={`(${shootingsByRegions.data.length} primeiros) / tiroteios`}
						{...shootingsByRegions}
						{..._props}
					/>
				)}
				{!!deathsByRegions.data && (
					<Graphic
						title="Mortos Por Região"
						subtitle={`(${deathsByRegions.data.length} primeiros) / mortos`}
						{...deathsByRegions}
						{..._props}
					/>
				)}
				{!!injuresByRegions.data && (
					<Graphic
						title="Feridos Por Região"
						subtitle={`(${injuresByRegions.data.length} primeiros) / feridos`}
						{...injuresByRegions}
						{..._props}
					/>
				)}

				{!!agentDeathsByMonth.data && (
					<Graphic
						title="Agentes Mortos Por Mês"
						subtitle={`(${agentDeathsByMonth.data.length} meses) / mortos`}
						{...agentDeathsByMonth}
						{..._props}
					/>
				)}
				{!!agentInjuresByMonth.data && (
					<Graphic
						title="Agentes Feridos Por Mês"
						subtitle={`(${agentInjuresByMonth.data.length} meses) / feridos`}
						{...agentInjuresByMonth}
						{..._props}
					/>
				)}
			</div>
		</>
	)
}

Grid.propTypes = {
	graphics: object,
	shootingsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByCities: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByNBRHDs: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	shootingsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	deathsByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	injuresByRegions: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentDeathsByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	agentInjuresByMonth: shape({ labels: arrayOf(string), data: arrayOf(number) }),
	requestImage: func,
}

export default Grid

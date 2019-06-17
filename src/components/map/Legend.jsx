/**
 * External dependencies
 */
import React from 'react'
import { number, shape } from 'prop-types'
/**
 * Internal dependencies
 */
import css from './Legend.module.css'

const _n = (singular, plural, count) => (+count !== 1 ? plural : singular)

const Legend = ({ stats }) => (
	<div className={css.wrap}>
		<div className={css.main}>
			<ul className={css.list}>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.total}</strong>
					<span className={css.label}>{_n('Tiroteio', 'Tiroteios', stats.total)}</span>
				</li>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.policeTotal}</strong>
					<span className={css.label}>Presença policial</span>
				</li>
			</ul>
			<ul className={css.list}>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.dead}</strong>
					<span className={css.label}>{_n('Morto', 'Mortos', stats.dead)}</span>
				</li>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.injured}</strong>
					<span className={css.label}>{_n('Ferido', 'Feridos', stats.injured)}</span>
				</li>
			</ul>
			<ul className={css.list}>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.policeDead}</strong>
					<span className={css.label}>
						{_n('Agente morto', 'Agentes mortos', stats.policeDead)}
					</span>
				</li>
				<li className={css.item}>
					<i className={css.icon} />
					<strong className={css.value}>{stats.policeInjured}</strong>
					<span className={css.label}>
						{_n('Agente ferido', 'Agentes feridos', stats.policeInjured)}
					</span>
				</li>
			</ul>
		</div>
	</div>
)

Legend.propTypes = {
	stats: shape({
		total: number,
		dead: number,
		injured: number,
		policeTotal: number,
		policeDead: number,
		policeInjured: number,
	}).isRequired,
}

export default Legend

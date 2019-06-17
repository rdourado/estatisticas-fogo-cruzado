/* global mapa_fogo_cruzado */
/**
 * External dependencies
 */
import React, { Component } from 'react'
import { arrayOf, bool, func, object, string, number } from 'prop-types'
import { HorizontalBar } from 'react-chartjs-2'
import classnames from 'classnames'
import shortid from 'shortid'
import deburr from 'lodash/deburr'
import fromPairs from 'lodash/fromPairs'
import kebabCase from 'lodash/kebabCase'
import memoize from 'lodash/memoize'
import unzip from 'lodash/unzip'
import values from 'lodash/values'
/**
 * Internal dependencies
 */
import css from './Graphic.module.css'
import Loading from './Gear'
import options from './chartConfig'
import Printer from './Printer'

const sanitize = x => kebabCase(deburr(JSON.stringify(x)))
const combine = (a, b) => fromPairs(unzip([a, b]))

class Graphic extends Component {
	state = {
		id: shortid(),
		hash: null,
		isOpen: false,
		haveImage: false,
	}

	componentDidMount() {
		const { data, labels } = this.props
		this.setHash(data, labels)
	}

	componentDidUpdate(prevProps) {
		const haveImage = !!this.props.graphics[this.state.hash]
		if (this.state.haveImage !== haveImage) {
			this.setState({ haveImage })
		}
		if (prevProps.hasChanged !== this.props.hasChanged) {
			const { data, labels } = this.props
			this.setHash(data, labels)
		}
	}

	setHash = memoize(
		(data, labels) => {
			const hash = sanitize(combine(labels, data))
			this.setState({ hash, isOpen: false, haveImage: false })
		},
		(...args) => values(args).join('_')
	)

	toggleShare = () => {
		const { requestImage } = this.props
		const { id, hash, isOpen, haveImage } = this.state
		this.setState({ isOpen: !isOpen }, () => !haveImage && requestImage({ id, hash }))
	}

	renderIcon = (site, url, children) => {
		const { graphics } = this.props
		const { hash } = this.state
		const imageURL = graphics[hash]
		const href = !url ? imageURL : url.replace(/%s/g, encodeURIComponent(imageURL))

		return (
			<a
				href={href}
				className={classnames(css.shareIcon)}
				target="_blank"
				rel="noopener noreferrer"
			>
				{children ? children : <i className={`socicon-${site}`} />}
			</a>
		)
	}

	render() {
		const { data, title, subtitle, labels } = this.props
		const { id, isOpen, haveImage } = this.state

		return (
			<article className={css.main}>
				<div id={id} className={css.body}>
					<header className={css.header}>
						<img src={mapa_fogo_cruzado.logo} alt="Logo" className={css.logo} />
						<div>
							<h3 className={css.title}>{title}</h3>
							<p className={css.subtitle}>{subtitle}</p>
						</div>
					</header>
					<HorizontalBar
						data={{
							labels,
							datasets: [{ data, label: 'Dados', backgroundColor: '#41616c' }],
						}}
						options={options}
						width={460}
						height={360}
					/>
				</div>
				<footer className={css.share}>
					<button type="button" className={css.shareTitle} onClick={this.toggleShare}>
						<span>Compartilhe</span>
						<i className="socicon-sharethis" />
					</button>
					{!!isOpen && (
						<div className={css.shareBody}>
							{!haveImage ? (
								<Loading />
							) : (
								<>
									{this.renderIcon(
										'facebook',
										`https://www.facebook.com/sharer/sharer.php?u=%s`
									)}
									{this.renderIcon(
										'twitter',
										`https://twitter.com/home?status=%s`
									)}
									{this.renderIcon('whatsapp', `whatsapp://send?text=%s`)}
									{this.renderIcon(
										'mail',
										`https://www.facebook.com/sharer/sharer.php?u=%s`
									)}
									{this.renderIcon('print', null, <Printer />)}
								</>
							)}
						</div>
					)}
				</footer>
			</article>
		)
	}
}

Graphic.propTypes = {
	data: arrayOf(number),
	graphics: object,
	hasChanged: bool,
	labels: arrayOf(string),
	requestImage: func.isRequired,
	subtitle: string.isRequired,
	title: string.isRequired,
}
Graphic.defaultProps = {
	data: [],
	labels: [],
}

export default Graphic

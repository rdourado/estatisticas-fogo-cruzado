/* globals mapa_fogo_cruzado */
import React, { useState, useEffect, useRef } from 'react'
import { arrayOf, bool, func, object, string, number } from 'prop-types'
import { HorizontalBar } from 'react-chartjs-2'
import moment from 'moment'
import shortid from 'shortid'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
import { breakpoint, colorOrange, colorGreyDark, fontSans } from '../../shared/styles'
import Loading from './Gear'
import options from './chartConfig'

function usePrevious(value) {
	const ref = useRef()
	useEffect(() => {
		ref.current = value
	})
	return ref.current
}

const Graphic = props => {
	const [id, setID] = useState(null)
	const [isOpen, setOpen] = useState(false)
	const [haveImage, setHaveImage] = useState(false)

	const { data, graphics, title, labels, dateRange } = props
	const prevData = usePrevious(data)

	useEffect(() => {
		setHaveImage(!!graphics[id])
	}, [graphics])

	useEffect(() => {
		if (!isEqual(prevData, data)) {
			setID(shortid())
			setOpen(false)
			setHaveImage(false)
		}
	}, [data])

	function toggleShare() {
		const { requestImage, filters } = props
		setOpen(!isOpen)
		if (!haveImage) {
			requestImage({ id, filters, data, labels })
		}
	}

	const period = dateRange
		.map(timestamp => moment.unix(timestamp).format('DD/MM/YYYY'))
		.join(' a ')

	return (
		<Main>
			<Body id={id}>
				<Header>
					<Logo src={mapa_fogo_cruzado.logo} alt="Logo" />
					<div>
						<Title>{title}</Title>
					</div>
				</Header>
				<Info>
					Gráfico gerado em {moment.utc().format('DD/MM/YYYY')}
					<br />
					Informações referentes ao período {period}
				</Info>
				<HorizontalBar
					data-html2canvas-ignore
					data={{
						labels,
						datasets: [{ data: [...data], label: 'Dados', backgroundColor: '#41616c' }],
					}}
					options={options}
					width={460}
					height={360}
				/>
				<Info>
					Fonte: Fogo Cruzado é um Data lab, laboratório de dados sobre violência armada,
					que agrega e disponibiliza informações através de um aplicativo e mapa
					colaborativo
				</Info>
			</Body>
			<Share>
				<ShareTitle type="button" onClick={toggleShare}>
					{!haveImage ? (
						<>
							<span>Gerar Imagem</span>
							<i className="dashicons dashicons-format-image" />
						</>
					) : (
						<>
							<a
								href={get(props, `graphics[${id}].image`)}
								target="_blank"
								rel="noopener noreferrer"
								download
							>
								Salvar
							</a>
							<i className="dashicons dashicons-download" />
						</>
					)}
				</ShareTitle>
				{isOpen && !haveImage && (
					<ShareBody>
						<Loading />
					</ShareBody>
				)}
			</Share>
		</Main>
	)
}

Graphic.propTypes = {
	filters: object,
	dateRange: arrayOf(number).isRequired,
	requestImage: func.isRequired,
	title: string.isRequired,
	data: arrayOf(number),
	graphics: object,
	hasChanged: bool,
	labels: arrayOf(string),
}
Graphic.defaultProps = {
	filters: {},
	data: [],
	labels: [],
}

const Main = styled.article`
	margin: 0 10px 30px;
	padding: 0;
	position: relative;

	@media (min-width: ${breakpoint}) {
		margin-bottom: 120px;
		width: calc(50% - 20px);
	}
`

const Body = styled.div`
	background: ${colorGreyDark};
	padding: 30px;
`

const Header = styled.header`
	align-items: center;
	display: flex;
	margin: 0 0 20px;
`

const Logo = styled.img`
	display: block;
	height: auto;
	margin: 0 15px 0 0;
	padding: 0;
	width: 60px;

	@media (min-width: ${breakpoint}) {
		width: 93px;
	}
`

const Title = styled.h3`
	color: ${colorOrange};
	font: 700 14px ${fontSans};
	margin: 0;
	padding: 0;
	text-align: left;
	text-transform: uppercase;

	@media (min-width: ${breakpoint}) {
		font-size: 20px;
	}
`

const Info = styled.p`
	color: #fff;
	font: 11px / 1.3 ${fontSans};
	margin: 10px;
	padding: 0;
	text-align: center;

	& ~ & {
		margin-bottom: 0;
		text-align: left;
	}
`

const Share = styled.footer`
	align-items: center;
	display: flex;
	font-size: 20px;
	justify-content: center;

	i {
		display: block;
	}

	svg {
		color: inherit;
		display: block;
		height: auto;
		width: 20px;
	}

	@media (min-width: ${breakpoint}) {
		left: 0;
		position: absolute;
		right: 0;
		top: calc(100% + 10px);
	}
`

const ShareTitle = styled.button`
	&,
	:hover,
	:focus {
		background: none;
		border: none;
		color: ${colorOrange};
		margin: 0 10px 0 0;
		outline: none;
	}

	> i {
		align-items: center;
		display: flex;
		font-size: 30px;
		height: 30px;
		justify-content: center;
		width: 30px;
	}

	> span,
	> a {
		display: none;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	@media (min-width: ${breakpoint}) {
		&,
		:hover,
		:focus {
			align-items: center;
			display: flex;
			font: 700 16px ${fontSans};
			margin: 0;
			padding: 0 0 5px;
			text-transform: uppercase;
		}

		> i {
			font-size: 24px;
			margin: 0 0 0 6px;
			width: 22px;

			&.dashicons-format-image {
				font-size: 22px;
			}
		}

		> span,
		> a {
			display: inline;
		}
	}
`

const ShareBody = styled.div`
	@media (min-width: ${breakpoint}) {
		background: ${colorGreyDark};
		border-radius: 16px;
		left: 50%;
		padding: 16px;
		position: absolute;
		top: calc(100% - 4px);
		transform: translateX(-50%);
		transition: opacity 0.3s !important;
		white-space: nowrap;
	}
`

export default Graphic

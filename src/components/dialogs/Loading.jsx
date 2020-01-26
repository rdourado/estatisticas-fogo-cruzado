/* globals mapa_fogo_cruzado */
import React from 'react'
import styled from 'styled-components'
import { fontSans, colorRed, colorGreyDark } from '../../shared/styles'

const Loading = () => (
	<Main>
		<Icon src={mapa_fogo_cruzado.loading} alt="" />
		<Title>Aguarde</Title>
		<Lead>
			Estamos carregando
			<br />
			os dados estatísticos
		</Lead>
	</Main>
)

Loading.propTypes = {}

const Main = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 0 120px;
	text-align: center;
`

const Icon = styled.img`
	display: block;
	height: auto;
	margin: 0 auto;
	max-width: 100%;
	object-fit: cover;
`

const Title = styled.p`
	color: ${colorRed};
	display: block;
	font: 20px ${fontSans};
	margin: 0 0 0.5em;
	padding: 0;
	text-transform: uppercase;
	:before {
		display: none !important;
	}
`

const Lead = styled.p`
	color: ${colorGreyDark};
	display: block;
	font: 20px ${fontSans};
	margin: 0;
	padding: 0;
`

export default Loading

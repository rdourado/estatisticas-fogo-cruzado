import React from 'react'
import styled from 'styled-components'
import IconError from './IconError'
import { fontSans, colorRed, colorGreyDark } from '../../shared/styles'

const FatalError = () => (
	<Main>
		<Icon />
		<Title>Erro!</Title>
		<Lead>
			Desculpe, alguma coisa saiu errada.
			<br />
			Por favor, refaça a sua navegação
			<br />
			<Link onClick={() => window.location.reload()}>clicando aqui.</Link>
		</Lead>
	</Main>
)

const Main = styled.div`
	padding: 120px 0;
	text-align: center;
`

const Icon = styled(IconError)`
	display: block;
	height: 64px;
	margin: 0 auto 45px;
	width: 64px;
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

const Link = styled.button`
	&,
	&:hover,
	&:focus {
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		font: inherit;
		margin: 0;
		padding: 0;
		text-decoration: underline;
	}
`

export default FatalError

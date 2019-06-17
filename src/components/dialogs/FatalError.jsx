import React from 'react'
import ErrorIcon from './ErrorIcon.svg'
import css from './FatalError.module.css'

const FatalError = () => (
	<div className={css.main}>
		<div className={css.icon}>
			<ErrorIcon />
		</div>
		<p className={css.title}>Erro!</p>
		<p className={css.lead}>
			Desculpe, alguma coisa saiu errada.
			<br />
			Por favor, refaça a sua navegação
			<br />
			<button className={css.link} onClick={() => window.location.reload()}>
				clicando aqui.
			</button>
		</p>
	</div>
)

FatalError.propTypes = {}

export default FatalError

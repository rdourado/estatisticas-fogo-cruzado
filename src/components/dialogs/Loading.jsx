/* globals mapa_fogo_cruzado */
import React from 'react'
import css from './Loading.module.css'

const Loading = () => (
	<div className={css.main}>
		<img src={mapa_fogo_cruzado.loading} alt="" />
		<p className={css.title}>Aguarde</p>
		<p className={css.lead}>
			Estamos carregando
			<br />
			os dados estatísticos
		</p>
	</div>
)

Loading.propTypes = {}

export default Loading

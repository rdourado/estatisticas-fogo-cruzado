/* global mapa_fogo_cruzado */
import html2canvas from 'html2canvas'

const fetchAction = (action, payload) =>
	fetch(mapa_fogo_cruzado.ajax_url + `?action=${action}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	}).then(res => res.json())

export const fetchParams = uf => fetchAction('fetch_map_params', uf)
export const fetchData = (filters, chunk) => fetchAction('fetch_map_data', { ...filters, chunk })
export const saveImage = data => fetchAction('create_graphic_image', data)
export const findImage = data => fetchAction('find_graphic_image', data)

export const createImage = ref =>
	html2canvas(ref, {
		backgroundColor: '#23292d',
		windowWidth: 970,
		scale: 1,
		logging: false,
		allowTaint: true,
	})

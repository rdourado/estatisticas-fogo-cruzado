import { createAction } from 'redux-starter-kit'

export const successData = createAction('mapa_fogo_cruzado/DATA_SUCCESS')
export const failureData = createAction('mapa_fogo_cruzado/DATA_FAILURE')
export const requestData = createAction('mapa_fogo_cruzado/DATA_START')

export const successParams = createAction('mapa_fogo_cruzado/PARAMS_SUCCESS')
export const failureParams = createAction('mapa_fogo_cruzado/PARAMS_FAILURE')
export const requestParams = createAction('mapa_fogo_cruzado/PARAMS_START')

export const successImage = createAction('mapa_fogo_cruzado/IMAGE_SUCCESS')
export const failureImage = createAction('mapa_fogo_cruzado/IMAGE_FAILURE')
export const requestImage = createAction('mapa_fogo_cruzado/IMAGE_REQUEST')

export const updateUF = createAction('mapa_fogo_cruzado/UF_UPDATE')
export const updateYear = createAction('mapa_fogo_cruzado/YEAR_UPDATE')
export const updateDate = createAction('mapa_fogo_cruzado/DATE_UPDATE')
export const updateRegion = createAction('mapa_fogo_cruzado/REGION_UPDATE')
export const updateCity = createAction('mapa_fogo_cruzado/CITY_UPDATE')
export const updateNBRHD = createAction('mapa_fogo_cruzado/NBRHD_UPDATE')
export const updateType = createAction('mapa_fogo_cruzado/TYPE_UPDATE')

import { Chart, defaults } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import merge from 'lodash/merge'

Chart.pluginService.register(ChartDataLabels)

merge(defaults, {
	global: {
		animation: false,
		defaultFontColor: '#fff',
		defaultFontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
		defaultFontSize: 14,
		legend: {
			display: false,
		},
		layout: {
			padding: { right: 30 },
		},
		plugins: {
			datalabels: {
				anchor: 'end',
				align: 'end',
			},
		},
	},
})

const options = {
	scales: {
		yAxes: [
			{
				barPercentage: 0.8,
				gridLines: { color: 'transparent' },
				ticks: { beginAtZero: true, fontSize: 14 },
			},
		],
		xAxes: [
			{
				gridLines: { color: 'transparent' },
				ticks: { fontSize: 10 },
			},
		],
	},
}

export default options

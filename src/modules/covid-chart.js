import Chart from 'chart.js/dist/Chart.bundle.min';
import getData from './api';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
let chart = null;

const getChartColors = (status, type) => {
  if (type === 'background') {
    if (status === 'cases') {
      return ['#c8354e'];
    }
    if (status === 'recovered') {
      return ['#33b349'];
    }
    if (status === 'deaths') {
      return ['#eeeeee'];
    }
  }
  if (type === 'border') {
    if (status === 'cases') {
      return ['#902039'];
    }
    if (status === 'recovered') {
      return ['#278040'];
    }
    if (status === 'deaths') {
      return ['#eeeeee'];
    }
  }
  return '#eeeeee';
};

export default function newChart(data, country, typeStatus) {
  const ctx = document.getElementById('covid-chart').getContext('2d');

  let typeAPI = '';
  if (typeStatus === 'All') {
    typeAPI = 'CountryByDays';
  }
  getData(typeAPI, country).then((countryData) => {
    let labels = [];
    const statuses = ['cases', 'recovered', 'deaths'];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const { timeline } = countryData;
    const { cases } = timeline;
    labels = Object.keys(cases).map((dateItem) => {
      const date = new Date(dateItem);
      const month = date.getMonth();
      return `${date.getDate()} ${months[month]}`;
    });
    const datasets = [];
    for (let i = 0; i < statuses.length; i += 1) {
      const chartStatus = statuses[i];
      let chartData = [];
      Object.entries(timeline).forEach(([item, dataObj]) => {
        if (item === chartStatus) {
          chartData = Object.values(dataObj);
        }
      });
      const dataset = {
        label: `${chartStatus} (${country})`,
        data: chartData,
        borderWidth: 2,
        backgroundColor: getChartColors(statuses[i], 'background'),
        borderColor: getChartColors(statuses[i], 'border'),
        fill: false,
      };
      datasets.push(dataset);
    }
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(ctx, {
      type: 'line',

      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              stepSize: 1000,
            },
          }],
        },
      },
    });
  });
}

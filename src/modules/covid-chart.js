import Chart from 'chart.js/dist/Chart.bundle.min';

import getData from './api';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
let chart = null;

function updateChart() {
  chart.data.labels = [];
  chart.options.title.text = 'Country not found or doesn\'t have any historical data';
  for (let i = 0; i < chart.data.datasets.length; i += 1) {
    chart.data.datasets[i].data = [];
  }
  chart.update();
}

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

export default async function newChart(data, country, typeStatus) {
  const ctx = document.getElementById('covid-chart').getContext('2d');

  let typeAPI = '';
  if (typeStatus === 'All') {
    typeAPI = 'CountryByDays';
  }
  try {
    const countryData = await getData(typeAPI, country);

    let labels = [];
    const statuses = ['cases', 'recovered', 'deaths'];
    const { timeline } = countryData;
    const { cases } = timeline;
    labels = Object.keys(cases).map((dateItem) => {
      const date = new Date(dateItem);
      return `${date.toISOString()}`;
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
        label: `${chartStatus}`,
        data: chartData,
        borderWidth: 2,
        backgroundColor: getChartColors(statuses[i], 'background'),
        hoverBorderColor: ' #eeeeee',
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
        title: {
          display: true,
          position: 'top',
          text: country,
          fontSize: 18,
        },
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          fontFamily: 'Roboto',
        },
        tooltips: {
          borderWidth: 2,
          borderColor: ' #1c1c22',
          backgroundColor: '#eeeeee',
          titleFontColor: ' #1c1c22',
          bodyFontColor: ' #1c1c22',
          callbacks: {
            labelColor(tooltipItem, labelChart) {
              const currentSet = labelChart.config.data.datasets[tooltipItem.datasetIndex];
              return {
                borderColor: currentSet.borderColor,
                backgroundColor: currentSet.backgroundColor,
              };
            },
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          yAxes: [
            {
              id: 'linearYAxis',
              type: 'linear',
              display: 'auto',
              ticks: {
                callback: (value) => value.toLocaleString(),
              },
            },
            {
              id: 'logYAxis',
              type: 'logarithmic',
              display: 'auto',
            },
          ],
          xAxes: [{
            type: 'time',
            position: 'bottom',
            time: {
              displayFormats: { day: 'MM/YY' },
              tooltipFormat: 'DD/MM/YY',
              unit: 'month',
            },
          }],
        },
      },
    });
  } catch (error) {
    console.log(`${error} chart: Country not found`);
    if (chart) {
      updateChart();
    }
  }
}

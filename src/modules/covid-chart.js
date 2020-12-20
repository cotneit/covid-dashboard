import Chart from 'chart.js/dist/Chart.bundle.min';
import getData from './api';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
/**
 * increasing the distance between diagram and legend
 */
Chart.Legend.prototype.afterFit = function () {
  this.height += 15;
};
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
      return ['#888888'];
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
      return [' #888888'];
    }
  }
  return '#eeeeee';
};

/**
 *
 * @param {number} caseValue - selected status value
 * @param {number} populationValue - population for selected country
 */
function indexPerPopulation(caseValue, populationValue) {
  return Math.round((caseValue / populationValue) * 100000);
}
/**
 *
 * @param {object} countryData - JSON
 * @param {string} country - selected country
 * @param {string} population - population of selected country
 * @param {string} typeStatus values: 'ALL', 'Last'
 * @param {string} showType values: 'cases', 'recovered', 'deaths'
 * @param {string} show values: 'Absolute', 'One hund'
 */
function createChart(countryData, country, population, showType, show) {
  const ctx = document.getElementById('covid-chart').getContext('2d');
  let labels = [];
  const { timeline } = countryData;
  const { cases, recovered, deaths } = timeline;
  let labelObj = cases;
  if (showType === 'recovered') {
    labelObj = recovered;
  } else if (showType === 'deaths') {
    labelObj = deaths;
  }
  labels = Object.keys(labelObj).map((dateItem) => {
    const date = new Date(dateItem);
    return `${date.toISOString()}`;
  });
  const datasets = [];
  let chartData = [];
  Object.entries(timeline).forEach(([item, dataObj]) => {
    if (item === showType) {
      chartData = Object.values(dataObj);
      if (show.trim() === 'One hund') {
        chartData = chartData.map((value) => indexPerPopulation(+value, +population));
      }
    }
  });
  const dataset = {
    label: `${showType}`,
    data: chartData,
    borderWidth: 2,
    backgroundColor: getChartColors(showType, 'background'),
    hoverBorderColor: ' #eeeeee',
    borderColor: getChartColors(showType, 'border'),
    fill: false,
  };
  datasets.push(dataset);

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
        fontColor: '#eeeeee',
      },
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          fontFamily: 'Roboto',
          fontColor: '#eeeeee',
        },
      },
      tooltips: {
        borderWidth: 2,
        borderColor: '#1c1c22',
        backgroundColor: '#eeeeee',
        titleFontColor: '#1c1c22',
        bodyFontColor: '#1c1c22',
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
}

function focusBtn(buttonStatus, color) {
  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i += 1) {
    const button = buttons[i];
    if (button.id.split('-').indexOf(buttonStatus) >= 0 || button.dataset.status === buttonStatus) {
      button.style.color = color;
    } else {
      button.style.color = '#ffff';
    }
  }
}

export default async function newChart(json, country, typeStatus, showType, show) {
  let typeAPI = '';
  if (typeStatus === 'All') {
    typeAPI = 'CountryByDays';
  }
  const { population } = json.find((obj) => obj.country === country);

  try {
    const countryData = await getData(typeAPI, country);
    createChart(countryData, country, population, showType, show);
    focusBtn(showType, getChartColors(showType, 'background'));

    const selectedStatus = document.querySelectorAll('.chart-buttons');
    selectedStatus.forEach((elem) => {
      if (elem.dataset.status === showType) {
        elem.focus();
      }
      elem.addEventListener('click', (event) => {
        const currentStatus = event.target;
        console.log(`currentStatus = ${currentStatus.dataset.status}`);
        createChart(countryData, country, population, currentStatus.dataset.status, show);
        focusBtn(currentStatus.dataset.status, getChartColors(currentStatus.dataset.status, 'background'));
      });
    });
  } catch (error) {
    console.log(`${error} chart: Country not found`);
    if (chart) {
      updateChart();
    }
  }
}

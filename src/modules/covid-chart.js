import Chart from 'chart.js/dist/Chart.bundle.min';
import getData from './api';
import { indexPerPopulation, getChartColors, increasePerDay } from './secondary-functions';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
/**
 * increasing the distance between diagram and legend
 */
function configChart() {
  Chart.defaults.global.defaultFontFamily = 'Roboto';
  Chart.defaults.global.defaultFontColor = '#eeeeee';
  Chart.Legend.prototype.afterFit = function () {
    this.height += 0;
  };
  Chart.Title.prototype.afterFit = function () {
    this.height -= 38;
  };
}
let chart = null;

function updateChart() {
  chart.data.labels = [];
  chart.options.title.text = 'Country not found or doesn\'t have any historical data';
  for (let i = 0; i < chart.data.datasets.length; i += 1) {
    chart.data.datasets[i].data = [];
  }
  chart.update();
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

class CreateChart {
  constructor(countryData, country, typeStatus, showType, show, population) {
    this.countryData = countryData;
    this.country = country;
    this.typeStatus = typeStatus;
    this.showType = showType;
    this.show = show;
    this.population = population;
  }

  draw() {
    if (this.countryData === null) {
      return;
    }
    const ctx = document.getElementById('covid-chart').getContext('2d');
    let labels = [];
    let timeline;
    if (this.country === 'Global') {
      timeline = this.countryData;
    } else {
      timeline = this.countryData.timeline;
    }

    const { cases, recovered, deaths } = timeline;
    let labelObj = cases;
    if (this.showType === 'recovered') {
      labelObj = recovered;
    } else if (this.showType === 'deaths') {
      labelObj = deaths;
    }
    labels = Object.keys(labelObj).map((dateItem) => {
      const date = new Date(dateItem);
      return `${date.toISOString()}`;
    });
    const datasets = [];

    let chartData = (this.typeStatus === 'Last') ? Object.values(timeline[this.showType]).map((value, index, work) => {
      let prevValue = 0;
      if (index > 0) {
        prevValue = work[index - 1];
      }
      return increasePerDay(+value, +prevValue);
    }) : Object.values(timeline[this.showType]);

    chartData = (this.show === 'One hund') ? chartData.map((value) => indexPerPopulation(+value, +this.population)) : chartData;

    let typeChart = 'line';
    if (this.typeStatus === 'Last') {
      typeChart = 'bar';
    }
    const dataset = {
      label: `${this.showType}`,
      data: chartData,
      borderWidth: 2,
      backgroundColor: getChartColors(this.showType, 'background'),
      hoverBorderColor: getChartColors(),
      borderColor: getChartColors(this.showType, 'border'),
      fill: false,
    };
    datasets.push(dataset);

    if (chart) {
      chart.destroy();
    }
    configChart();
    chart = new Chart(ctx, {
      type: typeChart,
      data: { labels, datasets },
      options: {
        title: {
          display: true,
          position: 'top',
          text: this.country,
          fontSize: 18,
          fontStyle: '500',
        },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            fontSize: 14,
          },
        },
        tooltips: {
          borderWidth: 2,
          borderColor: getChartColors('font', 'chart'),
          backgroundColor: getChartColors(),
          titleFontColor: getChartColors('font', 'chart'),
          bodyFontColor: getChartColors('font', 'chart'),
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
              gridLines: {
                color: getChartColors('gridLine', 'chart'),
                borderDash: [6, 2],
              },
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
          xAxes: [
            {
              gridLines: {
                display: true,
                color: getChartColors('gridLine', 'chart'),
                borderDash: [2, 4],
              },
              offsetGridLines: true,
              type: 'time',
              position: 'bottom',
              time: {
                displayFormats: { day: 'MM/YY' },
                tooltipFormat: 'DD/MM/YY',
                unit: 'month',
              },
            },
          ],
        },
      },
    });
  }
}

export default async function newChart(json, country, typeStatus, showType, show) {
  try {
    const location = document.querySelector('.location');
    const selectedLocation = location.options[location.selectedIndex].text;
    let globalData = null;

    if (selectedLocation === 'Global') {
      globalData = await getData('World');
    }

    const choice = (selectedLocation === 'Global') ? selectedLocation : country;
    const { population } = (selectedLocation === 'Global') ? globalData : json.find((obj) => obj.country === country);
    const countryAPI = (selectedLocation === 'Global') ? 'all' : country;
    const countryData = await getData('chartAPI', countryAPI);
    const chartNew = new CreateChart(countryData, choice, typeStatus, showType, show, population);
    chartNew.draw();
  } catch (error) {
    console.log(`${error} chart: Country not found or doesn't have any historical data`);
    if (chart) {
      updateChart();
    }
  }
}

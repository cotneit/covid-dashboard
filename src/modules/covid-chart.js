import Chart from 'chart.js/dist/Chart.bundle.min';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
let chart = null;

async function getChartData(selectedCountry, status) {
  let url = `https://api.covid19api.com/total/country/${selectedCountry}`;
  if (status !== 'All') {
    url = `${url}/status/${status}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const getChartColors = (status, type) => {
  if (type === 'background') {
    if (status === 'Confirmed') {
      return ['rgba(255, 99, 132, 0.2)'];
    }
    if (status === 'Recovered') {
      return ['rgba(91, 184, 52, 0.2)'];
    }
    if (status === 'Deaths') {
      return ['rgba(118, 128, 144, 0.2)'];
    }
  }
  if (type === 'border') {
    if (status === 'Confirmed') {
      return ['rgba(255, 99, 132, 1)'];
    }
    if (status === 'Recovered') {
      return ['rgba(91, 184, 52, 1)'];
    }
    if (status === 'Deaths') {
      return ['rgba(118, 128, 144, 1)'];
    }
  }
  return '';
};

export default function newChart(data, country, type) {
  const ctx = document.getElementById('covid-chart').getContext('2d');

  getChartData(country, type).then((countryData) => {
    const labels = [];
    let statuses = ['Confirmed', 'Recovered', 'Deaths'];
    if (type !== 'All') {
      statuses = ['Cases'];
    }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const datasets = [];
    countryData.forEach((item) => {
      const date = new Date(item.Date);
      const month = date.getMonth();
      labels.push(`${date.getDate()} ${months[month]}`);
    });
    for (let i = 0; i < statuses.length; i += 1) {
      const chartData = [];
      const statusLabel = new Set();
      countryData.forEach((item) => {
        if (item[statuses[i]]) {
          chartData.push(item[statuses[i]]);
          statusLabel.add(statuses[i]);
        }
      });
      const dataset = {
        label: `${Array.from(statusLabel)} (${country})`,
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
  getChartData.catch((error) => {
    console.log(`Ошибка получения данных${error}`);
  });
}

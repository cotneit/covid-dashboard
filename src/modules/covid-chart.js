import Chart from 'chart.js/dist/Chart.bundle.min';

/**
 * Источник: https://medium.com/swlh/create-a-covid-19-dashboard-with-javascript-373f46a11fcc
 */
let chart = null;

export default function newChart (data, country, type) {

    const ctx = document.getElementById('covid-chart').getContext('2d');

    getChartData(country, type).then((countryData) => {
        let labels = [];
        let statuses = ['Confirmed', 'Recovered', 'Deaths'];
        if (type !== 'All') {
            statuses = ['Cases'];
        }
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const datasets = [];
        countryData.forEach((item) => {
            let date = new Date(item['Date']);
            let month = date.getMonth();
            labels.push(`${date.getDate()} ${months[month]}`);
        });
        for (let i = 0; i < statuses.length; i++) {
            let statusLabel;
            let chartData;
            chartData = [];
            statusLabel = new Set();
            countryData.forEach((item) => {
                if(item[statuses[i]]){
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
        if(chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, {
                type: 'line',
         
            data: {labels, datasets},
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            stepSize: 1000,
                        }
                    }]
                }
            }
        });
    });
}

let getChartColors = (status, type) => {
    if (type === 'background') {
        if (status === 'Confirmed') {
            return ['rgba(255, 99, 132, 0.2)']
        }
        if (status === 'Recovered') {
            return ['rgba(91, 184, 52, 0.2)']
        }
        if (status === 'Deaths') {
            return ['rgba(118, 128, 144, 0.2)']
        }
    }
    if (type === 'border') {
        if (status === 'Confirmed') {
            return ['rgba(255, 99, 132, 1)']
        }
        if (status === 'Recovered') {
            return ['rgba(91, 184, 52, 1)']
        }
        if (status === 'Deaths') {
            return ['rgba(118, 128, 144, 1)']
        }
    }
}

async function getChartData(selectedCountry, status) {

    let url = 'https://api.covid19api.com/total/country/' + selectedCountry;
    if (status !== 'All') {
        url = url + "/status/" + status;
    }
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch (e){
        console.log(`Ошибка получения данных`);
    }
}

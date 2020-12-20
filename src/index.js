import getData from './modules/api';
import map from './modules/map';
import countriesTable from './modules/countries';
import newChart from './modules/covid-chart';
import showCountries from './modules/search';
import worldInfo from './modules/global';
import showCountryInfo from './modules/country-info';
import State from './modules/state';
import './scss/main.scss';

let globalData;

function init(data) {
  const state = new State(data, 'Belarus', 'All', 'Absolute');

  getData('World').then((res) => {
    globalData = res;
    worldInfo(res);
  });

  const index = data.map((e) => e.country).indexOf('Belarus');

  localStorage.setItem('map-zoom', 6);
  localStorage.setItem('search-scroll', 69.3 * index);
  localStorage.setItem('countries-scroll', 36.4 * index);

  state.subscribe('countriesTable', (json, country, type, show) => {
    countriesTable(json, country, type, show);
  });

  state.subscribe('countryInfo', (json, country, type, show) => {
    showCountryInfo(json, country, type, show);
  });

  state.subscribe('map', (json, country, type, show) => {
    map(json, country, type, 'cases', show);
  });

  state.subscribe('newChart', (json, country, type, show) => {
    newChart(json, country, type, 'cases', show);
  });

  state.subscribe('showCountries', (json, country, type, show) => {
    if (document.querySelector('#search').value !== '') {
      showCountries(json, country, type, show, document.querySelector('#search').value);
    } else {
      showCountries(json, country, type, show);
    }
  });

  state.subscribe('events', (json, country, type, show) => {
    document.querySelector('#map-cases').onclick = function () {
      map(json, country, type, 'cases', show);
      newChart(json, country, type, 'cases', show);
    };

    document.querySelector('#map-recovered').onclick = function () {
      map(json, country, type, 'recovered', show);
      newChart(json, country, type, 'recovered', show);
    };

    document.querySelector('#map-deaths').onclick = function () {
      map(json, country, type, 'deaths', show);
      newChart(json, country, type, 'deaths', show);
    };

    const selectedStatus = document.querySelectorAll('.chart-buttons');
    selectedStatus.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        const currentStatus = event.target;
        map(json, country, type, currentStatus.dataset.status, show);
      });
    });

    document.querySelector('#search').oninput = function (e) {
      showCountries(json, country, type, show, e.target.value);
    };

    document.querySelector('#time').onchange = function (e) {
      switch (e.target.value) {
        case '1':
          state.update(data, country, 'All', show);
          worldInfo(globalData);
          break;
        case '2':
          state.update(data, country, 'Last', show);
          worldInfo(globalData);
          break;
        default:
          state.update(data, country, 'All', show);
          worldInfo(globalData);
          break;
      }
    };

    document.querySelector('#values').onchange = function (e) {
      switch (e.target.value) {
        case '1':
          state.update(data, country, type, 'Absolute');
          worldInfo(globalData);
          break;
        case '2':
          state.update(data, country, type, 'One hund');
          worldInfo(globalData);
          break;
        default:
          state.update(data, country, type, 'Absolute');
          worldInfo(globalData);
          break;
      }
    };
  });
}

getData().then((data) => init(data));

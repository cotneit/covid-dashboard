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
  const state = new State(data, 'Belarus', 'All', 'cases', 'Absolute');

  getData('World').then((res) => {
    globalData = res;
    worldInfo(res);
  });

  const index = data.map((e) => e.country).indexOf('Belarus');
  const location = document.querySelector('.location');
  location.selectedIndex = 0;

  localStorage.setItem('map-zoom', 6);
  localStorage.setItem('countries-scroll', 'false');
  localStorage.setItem('search-scroll', 'false');
  localStorage.setItem('scroll-index', index);

  state.subscribe('countriesTable', (json, country, type, showType, show) => {
    countriesTable(json, country, type, showType, show);
  });

  state.subscribe('countryInfo', (json, country, type, showType, show) => {
    showCountryInfo(json, country, type, show);
  });

  state.subscribe('map', (json, country, type, showType, show) => {
    map(json, country, type, showType, show);
  });

  state.subscribe('newChart', (json, country, type, showType, show) => {
    newChart(json, country, type, showType, show);
  });

  state.subscribe('showCountries', (json, country, type, showType, show) => {
    if (document.querySelector('#search').value !== '') {
      showCountries(json, country, type, showType, show, document.querySelector('#search').value);
    } else {
      showCountries(json, country, type, showType, show);
    }
  });

  state.subscribe('events', (json, country, type, showType, show) => {
    document.querySelector('#map-cases').onclick = () => {
      state.update(data, country, type, 'cases', show);
    };

    document.querySelector('#map-recovered').onclick = () => {
      state.update(data, country, type, 'recovered', show);
    };

    document.querySelector('#map-deaths').onclick = () => {
      state.update(data, country, type, 'deaths', show);
    };

    document.querySelector('#chart-cases').onclick = () => {
      state.update(data, country, type, 'cases', show);
    };

    document.querySelector('#chart-recovered').onclick = () => {
      state.update(data, country, type, 'recovered', show);
    };

    document.querySelector('#chart-deaths').onclick = () => {
      state.update(data, country, type, 'deaths', show);
    };

    document.querySelector('#search').oninput = (e) => {
      showCountries(json, country, type, showType, show, e.target.value);
    };

    document.querySelector('#time').onchange = (e) => {
      const time = document.querySelector('#chart-time');
      switch (e.target.value) {
        case '1':
          time.selectedIndex = 0;
          state.update(data, country, 'All', showType, show);
          worldInfo(globalData);
          break;
        case '2':
          time.selectedIndex = 1;
          state.update(data, country, 'Last', showType, show);
          worldInfo(globalData);
          break;
        default:
          time.selectedIndex = 0;
          state.update(data, country, 'All', showType, show);
          worldInfo(globalData);
          break;
      }
    };

    document.querySelector('#values').onchange = (e) => {
      const values = document.querySelector('#chart-values');
      switch (e.target.value) {
        case '1':
          values.selectedIndex = 0;
          state.update(data, country, type, showType, 'Absolute');
          worldInfo(globalData);
          break;
        case '2':
          values.selectedIndex = 1;
          state.update(data, country, type, showType, 'One hund');
          worldInfo(globalData);
          break;
        default:
          values.selectedIndex = 0;
          state.update(data, country, type, showType, 'Absolute');
          worldInfo(globalData);
          break;
      }
    };

    document.querySelector('#chart-time').onchange = (e) => {
      const time = document.querySelector('#time');
      switch (e.target.value) {
        case '1':
          time.selectedIndex = 0;
          state.update(data, country, 'All', showType, show);
          worldInfo(globalData);
          break;
        case '2':
          time.selectedIndex = 1;
          state.update(data, country, 'Last', showType, show);
          worldInfo(globalData);
          break;
        default:
          time.selectedIndex = 0;
          state.update(data, country, 'All', showType, show);
          worldInfo(globalData);
          break;
      }
    };

    document.querySelector('#chart-values').onchange = (e) => {
      const values = document.querySelector('#values');
      switch (e.target.value) {
        case '1':
          values.selectedIndex = 0;
          state.update(data, country, type, showType, 'Absolute');
          worldInfo(globalData);
          break;
        case '2':
          values.selectedIndex = 1;
          state.update(data, country, type, showType, 'One hund');
          worldInfo(globalData);
          break;
        default:
          values.selectedIndex = 0;
          state.update(data, country, type, showType, 'Absolute');
          worldInfo(globalData);
          break;
      }
    };

    location.onchange = () => {
      state.updateWithout('map', data, country, type, showType, show);
    };
  });
}

getData().then((data) => init(data));

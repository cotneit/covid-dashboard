import getData from './modules/api';
import map from './modules/map';
import countriesTable from './modules/countries';
import State from './modules/state';
import showCountries from './modules/search';
import worldInfo from './modules/global';
import './scss/main.scss';

function init(data) {
  const state = new State(data, 'Belarus', 'All');

  const index = data.map((e) => e.country).indexOf('Belarus');
  localStorage.setItem('search-scroll', 69.3 * index);
  localStorage.setItem('countries-scroll', 36.4 * index);

  state.subscribe((json, country, type) => {
    countriesTable(json, country, type);
  });

  state.subscribe((json, country, type) => {
    map(json, country, type);
  });

  state.subscribe((json, country, type) => {
    if (document.querySelector('#search').value !== '') {
      showCountries(json, country, type, document.querySelector('#search').value);
    } else {
      showCountries(json, country, type);
    }

    document.querySelector('#search').addEventListener('input', (e) => {
      showCountries(json, country, type, e.target.value);
    });
  });
}

getData().then((data) => init(data));
getData('World').then((data) => worldInfo(data));

import getData from './modules/api';
import map from './modules/map';
import countriesTable from './modules/countries';
import State from './modules/state';
import './styles/style.css';

function init(data) {
  const state = new State(data, 'Belarus', 'All');

  state.subscribe((json, country, type) => {
    countriesTable(json, country, type);
  });

  state.subscribe((json, country, type) => {
    map(json, country, type);
  });
}

getData().then((data) => init(data));

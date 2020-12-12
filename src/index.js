import './styles/style.css';
import getData from './modules/api';
import map from './modules/map';

function init(data) {
  map(data);
}

getData().then((data) => init(data));

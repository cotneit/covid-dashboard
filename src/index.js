import getData from './modules/api';
import map from './modules/map';
import './styles/style.css';

function init(data) {
  map(data);
}

getData().then((data) => init(data));

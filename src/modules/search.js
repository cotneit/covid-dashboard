import State from './state';
import { getNumberWithCommas } from './secondary-functions';

// Источник: https://codepen.io/bludce/pen/KOmYyV?editors=0110

const list = document.querySelector('.country-list__inner');

export default function showCountries(data, country, type, showType, show, searchTerm = '') {
  const state = new State();
  const listItems = document.createDocumentFragment();
  const location = document.querySelector('.location');

  list.innerHTML = '';

  data
    .filter((item) => item.country.toLowerCase().includes(searchTerm.toLowerCase()))
    .forEach((obj) => {
      const li = document.createElement('li');
      const countryFlag = document.createElement('img');
      const countryName = document.createElement('h4');
      const countryInfo = document.createElement('div');
      const countryPopulation = document.createElement('h2');
      const countryPopulationText = document.createElement('h5');
      const index = data.map((e) => e.country).indexOf(obj.country);

      li.classList.add('country-item');
      countryInfo.classList.add('country-item__info');

      countryFlag.src = obj.countryInfo.flag;
      countryFlag.classList.add('country-item__flag');

      countryName.innerText = obj.country;
      countryName.classList.add('country-item__name');

      countryPopulation.innerText = getNumberWithCommas(obj.population);
      countryPopulation.classList.add('country-item__population');

      countryPopulationText.innerText = 'Population';
      countryPopulationText.classList.add('country-item__population--text');

      countryInfo.appendChild(countryPopulation);
      countryInfo.appendChild(countryPopulationText);

      li.appendChild(countryFlag);
      li.appendChild(countryName);
      li.appendChild(countryInfo);

      if (obj.country === country) li.style.background = '#1d1b1b';

      li.addEventListener('click', () => {
        location.selectedIndex = 0;
        localStorage.setItem('scroll-index', index);
        localStorage.setItem('search-scroll', list.scrollTop);
        localStorage.setItem('countries-scroll', 'false');
        state.update(data, obj.country, type, showType, show);
      });

      listItems.appendChild(li);
    });

  list.appendChild(listItems);

  if (localStorage.getItem('search-scroll') === 'false') {
    list.childNodes[localStorage.getItem('scroll-index')].scrollIntoView();
  } else {
    list.scrollTo(0, localStorage.getItem('search-scroll'));
  }
}

import State from './state';

// Источник: https://codepen.io/bludce/pen/KOmYyV?editors=0110

const list = document.querySelector('.country-list__inner');

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function showCountries(data, country, type, show, searchTerm = '') {
  const state = new State();
  const listItems = document.createDocumentFragment();

  list.innerHTML = '';

  data
    .filter((item) => item.country.toLowerCase().includes(searchTerm.toLowerCase()))
    .forEach((obj, index) => {
      const li = document.createElement('li');
      const countryFlag = document.createElement('img');
      const countryName = document.createElement('h4');
      const countryInfo = document.createElement('div');
      const countryPopulation = document.createElement('h2');
      const countryPopulationText = document.createElement('h5');

      li.classList.add('country-item');
      countryInfo.classList.add('country-item__info');

      countryFlag.src = obj.countryInfo.flag;
      countryFlag.classList.add('country-item__flag');

      countryName.innerText = obj.country;
      countryName.classList.add('country-item__name');

      countryPopulation.innerText = numberWithCommas(obj.population);
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
        localStorage.setItem('search-scroll', list.scrollTop);
        localStorage.setItem('countries-scroll', 36.4 * index);
        state.update(data, obj.country, type, show);
      });

      listItems.appendChild(li);
    });
  list.appendChild(listItems);
  list.scrollTo(0, localStorage.getItem('search-scroll'));
}

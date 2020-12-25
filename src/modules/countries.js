import State from './state';

// Источник: https://codepen.io/dcode-software/pen/zYGOrzK

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll('tr'));

  const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
  const comparator = (index, order) => (a, b) => order * collator.compare(
    a.children[index].innerHTML,
    b.children[index].innerHTML,
  );

  const sortedRows = rows.sort(comparator(column, dirModifier));

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  table.querySelectorAll('th').forEach((th) => th.classList.remove('th-sort-asc', 'th-sort-desc'));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-asc', asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-desc', !asc);
}

export default function countriesTable(data, country, type, showType, show) {
  const state = new State();
  const location = document.querySelector('.location');

  document.querySelector('#country').innerHTML = '';
  const divTable = document.createElement('div');
  divTable.className = 'country-table';

  const table = document.createElement('table');
  table.className = 'country-table__inner country_sort';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr class="country-table__row country-table__row--header"><th>Country</th><th>Cases</th><th>Deaths</th><th>Recovered</th></tr>';
  const tbody = document.createElement('tbody');

  data.forEach((elem, index) => {
    let cases; let deaths; let
      recovered;
    const tr = document.createElement('tr');
    tr.className = 'country-table__row';

    if (elem.country === country) {
      tr.style.background = '#902039';
    }

    if (type === 'All') cases = (show === 'Absolute') ? elem.cases : Math.round((elem.cases / elem.population) * 100000);
    else cases = (show === 'Absolute') ? elem.todayCases : Math.round((elem.todayCases / elem.population) * 100000);

    if (type === 'All') deaths = (show === 'Absolute') ? elem.deaths : Math.round((elem.deaths / elem.population) * 100000);
    else deaths = (show === 'Absolute') ? elem.todayDeaths : Math.round((elem.todayDeaths / elem.population) * 100000);

    if (type === 'All') recovered = (show === 'Absolute') ? elem.recovered : Math.round((elem.recovered / elem.population) * 100000);
    else recovered = (show === 'Absolute') ? elem.todayRecovered : Math.round((elem.todayRecovered / elem.population) * 100000);

    tr.innerHTML = `<tr><td>${elem.country}</td><td>${cases}</td><td>${deaths}</td><td>${recovered}</td></tr>`;
    tr.addEventListener('click', () => {
      location.selectedIndex = 0;
      localStorage.setItem('scroll-index', index);
      localStorage.setItem('search-scroll', 'false');
      localStorage.setItem('countries-scroll', divTable.scrollTop);
      state.update(data, elem.country, type, showType, show);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  divTable.appendChild(table);

  document.querySelector('#country').appendChild(divTable);

  if (localStorage.getItem('countries-scroll') === 'false') {
    const index = localStorage.getItem('scroll-index');
    if (index > 0) tbody.childNodes[index - 1].scrollIntoView();
    else divTable.scrollTo(0, 0);
  } else {
    divTable.scrollTo(0, localStorage.getItem('countries-scroll'));
  }

  document.querySelectorAll('.country_sort th').forEach((headerCell) => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAscending = headerCell.classList.contains('th-sort-asc');

      sortTableByColumn(tableElement, headIndex, !currentIsAscending);
    });
  });
}

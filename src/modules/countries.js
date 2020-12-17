import map from './map';

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

export default function countriesTable(data, country, type) {
  document.querySelector('#country').innerHTML = '';
  const divTable = document.createElement('div');
  divTable.className = 'country-table';

  const table = document.createElement('table');
  table.className = 'country-table__inner country_sort';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr class="country-table__row country-table__row--header"><th>Country</th><th>Cases</th><th>Deaths</th><th>Recovered</th></tr>';
  const tbody = document.createElement('tbody');

  data.forEach((elem) => {
    const tr = document.createElement('tr');
    tr.className = 'country-table__row';
    tr.innerHTML = `<tr><td>${elem.country}</td><td>${elem.cases}</td><td>${elem.deaths}</td><td>${elem.recovered}</td></tr>`;
    tr.addEventListener('click', () => map(data, elem.country, type));
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  divTable.appendChild(table);

  document.querySelector('#country').appendChild(divTable);

  document.querySelectorAll('.country_sort th').forEach((headerCell) => {
    headerCell.addEventListener('click', () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
      const currentIsAscending = headerCell.classList.contains('th-sort-asc');

      sortTableByColumn(tableElement, headIndex, !currentIsAscending);
    });
  });
}

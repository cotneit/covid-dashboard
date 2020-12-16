import map from './map';

const getSort = ({ target }) => {
  const order = (target.dataset.order = -(target.dataset.order || -1));
  const index = [...target.parentNode.cells].indexOf(target);
  const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
  const comparator = (index, order) => (a, b) => order * collator.compare(
    a.children[index].innerHTML,
    b.children[index].innerHTML,
  );

  for (const tBody of target.closest('table').tBodies) tBody.append(...[...tBody.rows].sort(comparator(index, order)));

  for (const cell of target.parentNode.cells) cell.classList.toggle('sorted', cell === target);
};

export default function countriesTable(data, country, type) {
  document.querySelector('#country').innerHTML = '';
  const divTable = document.createElement('div');
  divTable.className = 'table-overflow';

  const table = document.createElement('table');
  table.className = 'country-table country_sort';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Country</th><th>Cases</th><th>Deaths</th><th>Recovered</th></tr>';
  const tbody = document.createElement('tbody');

  data.forEach((elem) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<tr><td>${elem.country}</td><td>${elem.cases}</td><td>${elem.deaths}</td><td>${elem.recovered}</td></tr>`;
    tr.addEventListener('click', () => map(data, elem.country, type));
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  divTable.appendChild(table);

  document.querySelector('#country').appendChild(divTable);

  document.querySelectorAll('.country_sort thead').forEach((tableTH) => tableTH.addEventListener('click', (event) => getSort(event)));
}

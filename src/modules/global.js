export default function worldInfo(data) {
  document.querySelector('.header__last-updated').innerHTML = `Last updated: ${new Date(data.updated).toLocaleString()}`;

  for (let i = 1; i <= 3; i += 1) {
    const card = document.createElement('div');
    card.className = 'world-data__card';
    switch (i) {
      case 1:
        card.innerHTML = `<h3>${data.cases}</h3><p>Total cases</p>`;
        break;
      case 2:
        card.innerHTML = `<h3>${data.deaths}</h3><p>Total deaths</p>`;
        break;
      case 3:
        card.innerHTML = `<h3>${data.recovered}</h3><p>Total recovered</p>`;
        break;
      default:
        card.innerHTML = '';
        break;
    }
    document.querySelector('.world-data').appendChild(card);
  }
}

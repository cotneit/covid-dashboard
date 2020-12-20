import State from './state';

export default function worldInfo(data) {
  const state = new State();

  const type = state.getType();
  const show = state.getShow();

  document.querySelector('.header__last-updated').innerHTML = `Last updated: ${new Date(data.updated).toLocaleString()}`;
  document.querySelector('.world-data').innerHTML = '';

  for (let i = 1; i <= 3; i += 1) {
    let text;
    const card = document.createElement('div');
    card.className = 'world-data__card';
    switch (i) {
      case 1:
        if (type === 'All') text = (show === 'Absolute') ? data.cases : Math.round((data.cases / data.population) * 100000);
        else text = (show === 'Absolute') ? data.todayCases : Math.round((data.todayCases / data.population) * 100000);

        card.innerHTML = `<h3>${text}</h3><p>Total cases</p>`;
        break;
      case 2:
        if (type === 'All') text = (show === 'Absolute') ? data.deaths : Math.round((data.deaths / data.population) * 100000);
        else text = (show === 'Absolute') ? data.todayDeaths : Math.round((data.todayDeaths / data.population) * 100000);

        card.innerHTML = `<h3>${text}</h3><p>Total deaths</p>`;
        break;
      case 3:
        if (type === 'All') text = (show === 'Absolute') ? data.recovered : Math.round((data.recovered / data.population) * 100000);
        else text = (show === 'Absolute') ? data.todayRecovered : Math.round((data.todayRecovered / data.population) * 100000);

        card.innerHTML = `<h3>${text}</h3><p>Total recovered</p>`;
        break;
      default:
        if (type === 'All') text = (show === 'Absolute') ? data.cases : Math.round((data.cases / data.population) * 100000);
        else text = (show === 'Absolute') ? data.todayCases : Math.round((data.todayCases / data.population) * 100000);

        card.innerHTML = `<h3>${text}</h3><p>Total cases</p>`;
        break;
    }
    document.querySelector('.world-data').appendChild(card);
  }
}

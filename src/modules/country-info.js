const countryInfo = document.querySelector('.country-info');

export default function showCountryInfo(data, country, type, show) {
  const oneCountryInfo = data.find((obj) => obj.country === country);

  let cases; let recovered; let
    deaths;

  if (type === 'All') recovered = (show === 'Absolute') ? oneCountryInfo.recovered : Math.round((oneCountryInfo.recovered / oneCountryInfo.population) * 100000);
  else recovered = (show === 'Absolute') ? oneCountryInfo.todayRecovered : Math.round((oneCountryInfo.todayRecovered / oneCountryInfo.population) * 100000);

  if (type === 'All') cases = (show === 'Absolute') ? oneCountryInfo.cases : Math.round((oneCountryInfo.cases / oneCountryInfo.population) * 100000);
  else cases = (show === 'Absolute') ? oneCountryInfo.todayCases : Math.round((oneCountryInfo.todayCases / oneCountryInfo.population) * 100000);

  if (type === 'All') deaths = (show === 'Absolute') ? oneCountryInfo.deaths : Math.round((oneCountryInfo.deaths / oneCountryInfo.population) * 100000);
  else deaths = (show === 'Absolute') ? oneCountryInfo.todayDeaths : Math.round((oneCountryInfo.todayDeaths / oneCountryInfo.population) * 100000);

  countryInfo.innerHTML = `<div class="country-info__country">
        <img src="${oneCountryInfo.countryInfo.flag}">
        <h2>${country}</h2>
    </div>
    <ul>
      <li><strong>Cases:</strong> ${cases}</li>
      <li><strong>Recovered:</strong> ${recovered}</li>
      <li><strong>Deaths:</strong> ${deaths}</li>
      <li><strong>Last update:</strong> ${new Date(oneCountryInfo.updated).toLocaleString()}</li>
    </ul>`;
}

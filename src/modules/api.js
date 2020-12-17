// Источник: https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp

export default async function getData(type, ...args) {
  let response;
  switch (type) {
    case 'World':
      response = await fetch('https://disease.sh/v3/covid-19/all');
      break;
    case 'CountryByDays':
      response = await fetch(`https://disease.sh/v3/covid-19/historical/${args[0]}?lastdays=all`);
      break;
    default:
      response = await fetch('https://disease.sh/v3/covid-19/countries');
      break;
  }
  const data = await response.json();
  return data;
}

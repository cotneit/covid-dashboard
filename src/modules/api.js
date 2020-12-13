// Источник: https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp

export default async function getData(type) {
  let response;
  switch (type) {
    case 'Summary':
      response = await fetch('https://api.covid19api.com/summary');
      break;
    case 'Country':
      response = await fetch('https://api.covid19api.com/countries');
      break;
    case 'World':
      response = await fetch('https://api.covid19api.com/world/total');
      break;
    default:
      response = await fetch('https://corona.lmao.ninja/v2/countries');
      break;
  }
  const data = await response.json();
  return data;
}

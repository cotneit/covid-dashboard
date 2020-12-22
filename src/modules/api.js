// Источник: https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp

export default async function getData(type, ...args) {
  try {
    let response;
    switch (type) {
      case 'World':
        response = await fetch('https://disease.sh/v3/covid-19/all');
        break;
      case 'chartAPI':
        response = await fetch(`https://disease.sh/v3/covid-19/historical/${args[0]}?lastdays=all`);
        break;
      default:
        response = await fetch('https://disease.sh/v3/covid-19/countries');
        break;
    }
    if (!response.ok) {
      throw await response.json();
    }
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error('Failed to load');
  }
}

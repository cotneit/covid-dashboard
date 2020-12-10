
//Источник: https://dev.to/shoupn/javascript-fetch-api-and-using-asyncawait-47mp
export default async function getData(type) {
    let response = await fetch(`https://api.covid19api.com/${type}`);
    let data = await response.json()
    return data;
}

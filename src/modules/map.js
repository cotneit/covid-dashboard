import 'leaflet/dist/leaflet.css';
import L from 'leaflet/dist/leaflet';
import State from './state';

// Источник: https://www.freecodecamp.org/news/how-to-create-a-coronavirus-covid-19-dashboard-map-app-in-react-with-gatsby-and-leaflet/

let maps;
let marker;
let size;
let color;

function getSize(d) {
  if (d > 7) return [57, 57];
  if (d > 6) return [50, 50];
  if (d > 5) return [43, 43];
  if (d > 4) return [36, 36];
  if (d > 3) return [29, 29];
  if (d > 2) return [24, 24];
  if (d > 1) return [18, 18];
  return [15, 15];
}

export default function map(data, oneCountry, type, showType, show) {
  const state = new State();

  let casesString;
  const localZoom = localStorage.getItem('map-zoom');
  const oneCountryInfo = data.find((obj) => obj.country === oneCountry).countryInfo;
  const latlong = [oneCountryInfo.lat, oneCountryInfo.long];

  const geoJson = {
    type: 'FeatureCollection',
    features: data.map((country = {}) => {
      const { countryInfo = {} } = country;
      const { lat, long: lng } = countryInfo;
      return {
        type: 'Feature',
        properties: {
          ...country,
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      };
    }),
  };

  const mapboxAccessToken = 'pk.eyJ1Ijoicmlza2FpbCIsImEiOiJja2lqYWhlMnAwMHVvMnJxangzMXMxb3cyIn0.f3ZPrs6dKPQD_U-SDTJhzw';

  if (maps !== undefined) {
    maps.remove();
  }

  maps = L.map('map').setView(latlong, localZoom);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
    id: 'mapbox/dark-v9',
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(maps);

  const layerGroup = L.geoJSON(geoJson, {
    onEachFeature(feature, layer) {
      let content; let
        text;

      switch (showType) {
        case 'cases':
          if (type === 'All') text = (show === 'Absolute') ? feature.properties.cases : Math.round((feature.properties.cases / feature.properties.population) * 100000);
          else text = (show === 'Absolute') ? feature.properties.todayCases : Math.round((feature.properties.todayCases / feature.properties.population) * 100000);
          content = `<li><strong>Cases:</strong> ${text}</li>`;
          break;
        case 'recovered':
          if (type === 'All') text = (show === 'Absolute') ? feature.properties.recovered : Math.round((feature.properties.recovered / feature.properties.population) * 100000);
          else text = (show === 'Absolute') ? feature.properties.todayRecovered : Math.round((feature.properties.todayRecovered / feature.properties.population) * 100000);
          content = `<li><strong>Recovered:</strong> ${text}</li>`;
          break;
        case 'deaths':
          if (type === 'All') text = (show === 'Absolute') ? feature.properties.deaths : Math.round((feature.properties.deaths / feature.properties.population) * 100000);
          else text = (show === 'Absolute') ? feature.properties.todayDeaths : Math.round((feature.properties.todayDeaths / feature.properties.population) * 100000);
          content = `<li><strong>Deaths:</strong> ${text}</li>`;
          break;
        default:
          if (type === 'All') text = (show === 'Absolute') ? feature.properties.cases : Math.round((feature.properties.cases / feature.properties.population) * 100000);
          else text = (show === 'Absolute') ? feature.properties.todayCases : Math.round((feature.properties.todayCases / feature.properties.population) * 100000);
          content = `<li><strong>Cases:</strong> ${text}</li>`;
          break;
      }

      layer.bindPopup(`<h2>${feature.properties.country}</h2><ul>${content}</ul>`);
    },

    pointToLayer(feature, latlng) {
      switch (showType) {
        case 'cases':
          color = 'icon-marker__red';
          if (type === 'All') casesString = (show === 'Absolute') ? feature.properties.cases : Math.round((feature.properties.cases / feature.properties.population) * 100000);
          else casesString = (show === 'Absolute') ? feature.properties.todayCases : Math.round((feature.properties.todayCases / feature.properties.population) * 100000);
          break;
        case 'recovered':
          color = 'icon-marker__green';
          if (type === 'All') casesString = (show === 'Absolute') ? feature.properties.recovered : Math.round((feature.properties.recovered / feature.properties.population) * 100000);
          else casesString = (show === 'Absolute') ? feature.properties.todayRecovered : Math.round((feature.properties.todayRecovered / feature.properties.population) * 100000);
          break;
        case 'deaths':
          color = 'icon-marker__dark';
          if (type === 'All') casesString = (show === 'Absolute') ? feature.properties.deaths : Math.round((feature.properties.deaths / feature.properties.population) * 100000);
          else casesString = (show === 'Absolute') ? feature.properties.todayDeaths : Math.round((feature.properties.todayDeaths / feature.properties.population) * 100000);
          break;
        default:
          color = 'icon-marker__red';
          if (type === 'All') casesString = (show === 'Absolute') ? feature.properties.cases : Math.round((feature.properties.cases / feature.properties.population) * 100000);
          else casesString = (show === 'Absolute') ? feature.properties.todayCases : Math.round((feature.properties.todayCases / feature.properties.population) * 100000);
          break;
      }

      size = getSize(casesString.toString().length);

      if (!Number.isFinite(casesString)) return 0;

      if (casesString.toString().length > 4) {
        casesString = `${casesString.toString().slice(0, -3)}k+`;
      }

      if (casesString !== 0 && !Number.isNaN(casesString)) {
        if (feature.properties.country === oneCountry) {
          marker = L.marker(latlng, {
            icon: new L.DivIcon({
              className: `icon-marker ${color}`,
              iconSize: size,
              popupAnchor: [-3, -15],
              html: `<span class="my-div-span">${casesString}</span>`,
            }),
          }).on('click', () => {
            const index = data.map((e) => e.country).indexOf(feature.properties.country);
            localStorage.setItem('search-scroll', 69.3 * index);
            localStorage.setItem('countries-scroll', 36.4 * index);
            localStorage.setItem('map-zoom', maps.getZoom());
            state.updateWithout('map', data, feature.properties.country, type);
          });
          return marker;
        }
        return L.marker(latlng, {
          icon: new L.DivIcon({
            className: `icon-marker ${color}`,
            iconSize: size,
            popupAnchor: [-3, -15],
            html: `<span class="my-div-span">${casesString}</span>`,
          }),
        }).on('click', () => {
          const index = data.map((e) => e.country).indexOf(feature.properties.country);
          localStorage.setItem('search-scroll', 69.3 * index);
          localStorage.setItem('countries-scroll', 36.4 * index);
          localStorage.setItem('map-zoom', maps.getZoom());
          state.updateWithout('map', data, feature.properties.country, type, show);
        });
      }
      return 0;
    },
  }).addTo(maps);

  layerGroup.addTo(maps);
  marker.openPopup();
}

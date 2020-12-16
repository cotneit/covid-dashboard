import 'leaflet/dist/leaflet.css';
import L from 'leaflet/dist/leaflet';

// Источник: https://www.freecodecamp.org/news/how-to-create-a-coronavirus-covid-19-dashboard-map-app-in-react-with-gatsby-and-leaflet/

let maps; let
  marker;

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

export default function map(data, oneCountry, type) {
  let casesString;
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

  maps = L.map('map').setView(latlong, 7);
  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(maps);

  const layerGroup = L.geoJSON(geoJson, {
    onEachFeature(feature, layer) {
      layer.bindPopup(`
          <h2>${feature.properties.country}</h2>
          <ul>
            <li><strong>Confirmed:</strong> ${feature.properties.cases}</li>
            <li><strong>Deaths:</strong> ${feature.properties.deaths}</li>
            <li><strong>Recovered:</strong> ${feature.properties.recovered}</li>
            <li><strong>Last Update:</strong> ${new Date(feature.properties.updated).toLocaleString()}</li>
          </ul>`);
    },

    pointToLayer(feature, latlng) {
      casesString = (type === 'All') ? `${feature.properties.cases}` : `${feature.properties.todayCases}`;

      if (feature.properties.cases > 1000) {
        casesString = `${casesString.slice(0, -3)}k+`;
      }

      if (feature.properties.country === oneCountry) {
        marker = L.marker(latlng, {
          icon: new L.DivIcon({
            className: 'icon-marker',
            iconSize: getSize(feature.properties.cases.toString().length),
            popupAnchor: [-3, -15],
            html: `<span class="my-div-span">${casesString}</span>`,
          }),
        });
        return marker;
      }
      return L.marker(latlng, {
        icon: new L.DivIcon({
          className: 'icon-marker',
          iconSize: getSize(feature.properties.cases.toString().length),
          popupAnchor: [-3, -15],
          html: `<span class="my-div-span">${casesString}</span>`,
        }),
      });
    },
  }).addTo(maps);

  layerGroup.addTo(maps);
  marker.openPopup();
}

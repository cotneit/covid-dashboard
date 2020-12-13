import 'leaflet/dist/leaflet.css';
import L from 'leaflet/dist/leaflet';
// Источник: https://www.freecodecamp.org/news/how-to-create-a-coronavirus-covid-19-dashboard-map-app-in-react-with-gatsby-and-leaflet/

export default function map(data) {
  let casesString;

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
  const maps = L.map('map').setView([37.8, -96], 4);

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
      casesString = `${feature.properties.cases}`;

      if (feature.properties.cases > 1000) {
        casesString = `${casesString.slice(0, -3)}k+`;
      }

      return L.marker(latlng, {
        icon: new L.DivIcon({
          className: 'icon-marker',
          iconSize: [57, 57],
          popupAnchor: [-3, -15],
          html: `<span class="my-div-span">${casesString}</span>`,
        }),
      });
    },
  }).addTo(maps);

  layerGroup.addTo(maps);
}

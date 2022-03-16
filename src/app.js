import Globe from 'globe.gl';
import { request, getCoordinates, } from './utils';
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
} from './constants';
import * as d3 from 'd3';

// Globe container
const globeContainer = document.getElementById('globeViz');

const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1 / 4);
const getVal = (feat) => {
  return "hi";
};

let world;


init();

function init() {
  world = Globe()(globeContainer)
    .globeImageUrl(GLOBE_IMAGE_URL)
    .backgroundImageUrl(BACKGROUND_IMAGE_URL)
    .showGraticules(false)
    .polygonAltitude(0.06)
    .polygonSideColor(() => 'rgba(0,0,100,0)')
    .polygonStrokeColor(() => '#111')
    .onPolygonHover((hoverD) =>
      world
        .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
        .polygonCapColor((d) =>
          d === hoverD ? 'steelblue' : colorScale(getVal(d))
        )
    )
    .polygonsTransitionDuration(200);

  getSongs();
}


let featureCollection = [];

//This Function is where the coordinates from your mouse get matched
// with the proper country. GEOJSON is a huge JSON file with names and ranges
async function getSongs() {
  featureCollection = (await request(GEOJSON_URL)).features;

  //Under Title Information
  document.querySelector('.title-desc').innerHTML =
    'Drop Discover Diversify';

  updatePolygonsData();

  updatePointOfView();
}

//Functionaity for retrieveing the data
function updatePolygonsData() {
  for (let x = 0; x < featureCollection.length; x++) {
    const country = featureCollection[x].properties.NAME;
  }

  world.polygonsData(featureCollection);
  world.onObjectHover(console.log(clicked));
}

async function updatePointOfView() {
  // Get coordinates
  try {
    const { latitude, longitude } = await getCoordinates();

    world.pointOfView(
      {
        lat: latitude,
        lng: longitude,
      },
      1000
    );
  } catch (e) {
    console.log('Unable to set point of view.');
  }
}

// Responsive globe
window.addEventListener('resize', (event) => {
  world.width([event.target.innerWidth]);
  world.height([event.target.innerHeight]);
});


import Globe from 'globe.gl';
import { request, getCoordinates, } from './utils';
import {
  GLOBE_IMAGE_URL,
  BACKGROUND_IMAGE_URL,
  GEOJSON_URL,
} from './constants';
import * as d3 from 'd3';
import React from "react";
import "./App.css";
import Login from "./Login";

function App() {
  return (
    <div className="app">
      <Login />
    </div>
  );
}


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
    .polygonLabel(({ properties: d}) => {
      return `
        <div class="card">
          <div class="container">
             <span class="card-title"><b>${d.NAME}</b></span> <br />
             <div class="card-spacer"></div>
             <hr />
             Top 5 Songs<br>
             1.<br>
             2.<br>
             3.<br>
             4.<br>
             5.<br>
             <div class="card-spacer"></div>
          </div>
        </div>
      `;
    })
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

// export default App;
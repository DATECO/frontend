import React, { Component } from 'react'
import ReactMapGL, { StaticMap, Marker, Popup, CanvasOverlay } from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import { createGlobalStyle } from 'styled-components';

import Pin from './components/Pin.jsx';
import NavBar from '../components/NavBar.jsx';
import { closestInterpolate, inverseDistanceInterpolate } from '../utils/interpolate';
import { URL } from '../utils/constants';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoid2lsbGlhbWJvcmdlYXVkIiwiYSI6ImNqcHgzdmp5azBpOTk0M2puZG51ZG5tM2oifQ.JmEQT7uJE0MrIZHIFjRIkg'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
  };
`

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: 47,
        longitude: 8.4,
        zoom: 7,
        minZoom: 7,
        maxZoom:10
      },
      stations: [],
      isLoading: false,
      clickedStation: null,
      measures: []
    };

    this.mapRef = React.createRef();

    this.getMeasures = this.getMeasures.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this._redraw = this._redraw.bind(this);
    this._onClickStation = this._onClickStation.bind(this);
  }
  
  componentDidMount() {
    fetch(URL+'api/stations/')
      .then(res => res.json())
      .then(stations => {
        fetch(URL+'api/lastmeasures/')
          .then(res => res.json())
          .then(res => {
            res.forEach(x => stations.filter(y => y.id===x.station)[0].temperature = x.temperature);
            this.setState({measures: res, stations})
          });
      })
      .catch(err => console.error(err));
      const delaunay = require('./data/delaunay.json');
      this.setState({delaunay: delaunay});
  }

  async getMeasures(station) {
    console.log('Loading...');
    console.log(station.name);
    this.setState({isLoading: true});
    let id = station.id;
    let res = await fetch(URL+`api/measures/${id}`);
    let data = await res.json();
    this.setState({isLoading: false});
    return data;
  }

  _renderPopup() {

    let { clickedStation: station } = this.state;
    
    if (station !== null) {
      return (
        <Popup tipSize={5}
          anchor="top"
          longitude={station.longitude}
          latitude={station.latitude}
          closeOnClick={true}
          onClose={() => this.setState({clickedStation: null})}
          >
          <div ><p>{station.name}</p><p>{station.temperature}</p></div>
        </Popup>
      );
    }
  }

  _redraw({ width, height, ctx, project, unproject }) {
    const L = 10;
    const {delaunay} = this.state
    ctx.clearRect(0, 0, width, height);
    let temps = [];
    for (let x=0; x<width;){
      for (let y=0; y<width;){
        let [lon, lat] = unproject([x+L/2,y+L/2]);
        // let temp = inverseDistanceInterpolate(lon,lat,this.state.stations);
        let temp = inverseDistanceInterpolate(lon,lat, delaunay)
        temps.push([x,y,temp]);
        y = y + L;
      }
      x = x + L;
    }
    let max = Math.max(...temps.map(x => x[2]));
    let min = Math.min(...temps.map(x => x[2]));
    temps.forEach(arr => {
      ctx.fillStyle = `rgba(0,${256*((arr[2]-min)/(max-min))},0,0.5)`;
      ctx.fillRect(arr[0],arr[1],L,L);
    });
  }

  _onClickStation(station) {
    this.setState({clickedStation: station},() => {
    this.getMeasures(station)
      .then(res => this.setState({ measures: res }))
      .catch(err => console.error(err));
      });
    }

  render() {
    return (
        <ReactMapGL
          {...this.state.viewport}
          ref={map => this.mapRef=map}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          width={'100vw'}
          height={'100vh'}
          reuseMap={true}
        >
          <CanvasOverlay redraw={this._redraw} captureClick={false} />

          {this.state.stations.map(station => {
            return (
              <Marker key={station.nameId} latitude={station.latitude} longitude={station.longitude}>
                <Pin onClick={() => this._onClickStation(station)}/>
              </Marker>
              );
            })
          }
          {this._renderPopup()}
        </ReactMapGL>
    );
  }
}
export default class Platform extends Component {
  render() {
    return(
    <>
      <GlobalStyles />
      <NavBar alwaysDisplay />
      <Map />
    </>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticMap } from "react-map-gl";
import DeckGL, { PolygonLayer, ScatterplotLayer } from "deck.gl";
import Delaunator from "delaunator";

import { COLOR_MAP, UNITS, URL } from "../utils/constants";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoid2lsbGlhbWJvcmdlYXVkIiwiYSI6ImNqcHgzdmp5azBpOTk0M2puZG51ZG5tM2oifQ.JmEQT7uJE0MrIZHIFjRIkg";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullStations: [],
      stations: [],
      isLoading: false,
      data: [],
      colorMap: COLOR_MAP["coolwarm"],
    };

    this.mapRef = React.createRef();
    this.deckRef = React.createRef();

    this._renderLayers = this._renderLayers.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._getFillColor = this._getFillColor.bind(this);
    this.setAllData = this.setAllData.bind(this);
    this.fetchNewData = this.fetchNewData.bind(this);
  }

  componentDidMount() {
    // Fetch data from backend.

    this.fetchNewData();
  }

  componentDidUpdate(prevProps) {
    // Check if some props have changed.

    if (prevProps.parameter !== this.props.parameter) {
      // If the parameter has changed, change the data to remove stations not having this
      // parameter and recompute Delaunay with new stations.
      this.setAllData(this.state.fullStations, this.state.interpolData);
      this.deckRef.current.deck.setProps({ layers: this._renderLayers() });
    } else if (
      prevProps.threeD !== this.props.threeD ||
      prevProps.scale3D !== this.props.scale3D ||
      prevProps.opacity !== this.props.opacity ||
      prevProps.showStation !== this.props.showStation
    ) {
      // If 3D, scale3D, opacity, or showStations change, only recompute the layers to
      // accomodate these changes.
      this.deckRef.current.deck.setProps({ layers: this._renderLayers() });
    } else if (
      prevProps.time &&
      prevProps.time.getTime() !== this.props.time.getTime()
    ) {
      // If time changes, fetch new data (specifying the time) and recompute layers with new data.
      this.fetchNewData(false);
      this.deckRef.current.deck.setProps({ layers: this._renderLayers() });
    }
  }

  fetchNewData(lastmeasures = true) {
    // Fetch data from backend. If lastmeasures is true, fetch the last 20 minutes of average data.
    // Otherwise, fetch data with measurement time set to props.time and take the average of the last 20 minutes.
    // Then fetch interpolated data which will be used to compute triangulation for smooth heatmaps.
    // Then cal setAllData to compute Delaunay.

    let url;
    let time;
    if (lastmeasures) {
      // time = Math.round((new Date()).getTime() / 1000);
	 time = 1593247341;
      url = URL+`api/avgmeasures/?start=${time-20*60+10}&end=${time}`;
    } else {
      time = this.props.time.getTime() / 1000;
      url = URL+`api/avgmeasures/?start=${time-20*60+10}&end=${time}`;
    }
    fetch(URL+"api/stations/")
      .then(res => res.json())
      .then(stations => {
        fetch(url)
          .then(res => res.json())
          .then(mes => {
            stations = stations.map(x => ({
              ...x,
              ...mes.filter(m => {
                return m.station === x.id;
              })[0]
            }));
            this.setState({ fullStations: stations });
            fetch(URL+`api/interpol/?start=${time-20*60}&end=${time}`)
              .then(res => res.json())
              .then(res => {
                this.props.change('hasLoaded', true);
                this.setState({interpolData: res});
                this.setAllData(stations, res);
              })
          });

      });
  }

  setAllData(fullStations, interpolData) {
    // Compute Delaunay triangulation for stations which display current props.parameter.

    let stations = fullStations.filter(x => x[this.props.parameter] !== null);
    stations = [...stations, ...interpolData.filter(x => x[this.props.parameter] !== null)]
    const triangles = Delaunator.from(
      stations.map(x => [x.longitude, x.latitude])
    ).triangles;
    const trianglesCoordinates = [];
    for (let i = 0; i < triangles.length; i += 3) {
      let [a,b,c] = [
        stations[triangles[i]],
        stations[triangles[i + 1]],
        stations[triangles[i + 2]]
      ];
      // Only consider triangles where vertices are close together. This is make the heatmap 
      // have the shape of Switzerland (otherwise the triangulation cuts borders).
      if ((Math.max(Math.abs(a.longitude-b.longitude),
        Math.abs(a.longitude-c.longitude),
        Math.abs(b.longitude-c.longitude))<0.1) &&
      (Math.max(Math.abs(a.latitude-b.latitude),
        Math.abs(a.latitude-c.latitude),
        Math.abs(b.latitude-c.latitude))<0.1)) {

      trianglesCoordinates.push([
        stations[triangles[i]],
        stations[triangles[i + 1]],
        stations[triangles[i + 2]]
      ]);
    } }
    const minMax = [
      Math.min(...stations.map(x => x[this.props.parameter])),
      Math.max(...stations.map(x => x[this.props.parameter]))
    ];
    this.setState({ stations, trianglesCoordinates, minMax });
  }

  _renderLayers() {
    // Render the layers: 1st the polygon layer, displaying the triangulation with color at vertices
    // given by value of the parameter at the station. 2nd the scatterplot layer showing the stations
    // which can be hovered and clicked to display info on the station.

    return [
      new PolygonLayer({
        id: "polygon-layer",
        data: this.state.trianglesCoordinates,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        elevationScale: this.props.scale3D,
        lineWidthMinPixels: 1,
        getPolygon: d =>
          d.map(x =>
            this.props.threeD
              ? [x.longitude, x.latitude, x.altitude]
              : [x.longitude, x.latitude]
          ),
        getFillColor: this._getFillColor,
        getLineColor: [80, 80, 80, 0],
        getLineWidth: 0,
        zIndex: 1000,
        updateTriggers: {
          getFillColor: this.props.parameter,
          getPolygon: [this.props.threeD, this.props.opacity],
          elevationScale: this.props.scale3D
        }
      }),
      new ScatterplotLayer({
        id: "scatter-layer",
        data: this.state.stations.filter(x => x.station), //points that are actually stations, not interpolated.
        pickable: true,
        radiusScale: this.props.showStation ? 2 : 0,
        getPosition: d => [d.longitude, d.latitude],
        getRadius: 500,
        getFillColor: [10, 10, 10, 255],
        getPolygonOffset: () => [0, -800000],
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          }),
        onClick: info => this.props.change('clickedStation',info.object),
        getCursor: () => "pointer",
        updateTriggers: {
          instanceRadius: this.props.showStation
        }
      })
    ];
  }

  _getFillColor(d) {
    // Get the color in which to fill the triangles in the PolygonLayer. Depends on the parameter,
    // opacity and colormap. Returns an array containing 3 RGBA values, one for each vertex of the triangle.
    // Deck.gl creates the gradient in the triangle from these values.

    const param = this.props.parameter;
    const [min, max] = this.state.minMax;
    let temp;
    if (min===max) {
      temp = d.map(x=>0);
    } else {
      temp = d.map(x => Math.floor((255 * (x[param] - min)) / (max - min)));
    }
    const opa = this.props.opacity;
    const cm = COLOR_MAP[param === "temperature" ? "coolwarm" : "plasma"];
    return [...cm[temp[0]], opa, ...cm[temp[1]], opa, ...cm[temp[2]], opa];
  }

  _renderTooltip() {
    // Renders the tooltip for the hovered station. Display station name and measure of the parameter.

    const { hoveredObject, pointerX, pointerY } = this.state || {};

    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            padding: "5px"
          }}
        >
          <div>{hoveredObject.name}</div>
          <div>
            {hoveredObject[this.props.parameter]} {UNITS[this.props.parameter]}
          </div>
        </div>
      )
    );
  }

  render() {
    return (
      <DeckGL
        ref={this.deckRef}
        layers={this._renderLayers()}
        initialViewState={{
          latitude: 47,
          longitude: 8.2,
          zoom: 7,
          minZoom: 7,
          maxZoom: 10,
          pitch: 0,
          bearing: 0
        }}
        width="100%"
        height="100%"
        controller={true}
        getCursor={() => "default"}
      >
        <StaticMap
          reuseMaps={true}
          mapStyle={`mapbox://styles/mapbox/${this.props.mapStyle}-v9`}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          ref={map => (this.mapRef = map)}
        />
        {this._renderTooltip}
      </DeckGL>
    );
  }
}

Map.propTypes = {
  // Parameter to display (e.g temperature, pressure,...)
  parameter: PropTypes.string,
  // If true, give z-coordinate to triangles corresponding to altitude.
  threeD: PropTypes.bool,
  // Gives the scale of the z-coordinates. More high it is, more high are peaks in map.
  scale3D: PropTypes.number,
  // Function to set time in parent component.
  setTime: PropTypes.func,
  // Time at which to display the data.
  time: PropTypes.instanceOf(Date),
  // Function to set the clicked station, on which the information box is displayed.
  setClickedStation: PropTypes.func,
  // Opacity of the map.
  opacity: PropTypes.number,
  // If true, show the station in the ScatterPlot layer.
  showStation: PropTypes.bool,
  // Map style (light, dark or basic).
  mapStyle: PropTypes.string
};

export default Map;

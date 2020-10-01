import React, { Component } from "react";

import { GlobalStyles } from "./SwissApp.jsx";
import NavBar from "./components/NavBar.jsx";
import CommandPanel from "./components/CommandPanel.jsx";
import ShowTime from "./components/ShowTime.jsx";
import ShowMeasures from "./components/ShowMeasures.jsx";
import Map from "./components/Map.jsx";
import Graphs from "./components/GraphContainer.jsx";
import WelcomeModal from "./components/WelcomeModal.jsx";
import { URL } from './utils/constants';
// const Graphs = React.lazy(() => import('./components/Graphs.jsx'));

const getModal = () => {
  if (localStorage.getItem('visitedBefore') !== null) {
    return false;
  } else {
    localStorage.setItem('visitedBefore',1);
    return true;
  }
}

export default class Platform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: getModal(),
      time: null,
      heightNav: 0,
      parameter: "temperature",
      threeD: true,
      scale3D: 8,
      opacity: 200,
      showStation: true,
      mapStyle: "dark",
      clickedStation: {},
      showGraphs: false,
      hasLoaded: false
    };
    this.setTime = this.setTime.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.refNav = React.createRef();
    this.change = this.change.bind(this);
  }

  componentDidMount() {
    // Set the height of the NavBar and fetch latest time of measurement.

    this.setState({ heightNav: this.refNav.offsetHeight });
    this.updateTime();
  }

  setTime(t, z = true) {
    // Set the time given the string t in the format of the backend.
    // If z is true, time is utc. Otherwise, time is local.

    if (z) {
      t = new Date(t + "Z");
    } else {
      t = new Date(t);
    }
    this.setState({ time: t });
  }

  updateTime() {
    // Fetch latest time of measurement in backend and setState on it.

    fetch(URL+"api/lastdate/")
      .then(res => res.json())
      .then(x => this.setTime(x.time));
  }

  change(key, value) {
    // Sets state on given key-value pair.
    
    this.setState({ [key]: value });
  }

  render() {
    const {
      time,
      heightNav,
      parameter,
      threeD,
      scale3D,
      opacity,
      showStation,
      mapStyle,
      clickedStation,
      showGraphs,
      hasLoaded,
      showModal
    } = this.state;
    return (
      <>
        <GlobalStyles />

        <NavBar
          addRef={ref => (this.refNav = ref)}
          alwaysDisplay
          notHome
          demo
          change={this.change}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100vh",
            alignItems: "stretch",
            margin: "0px auto"
          }}
        >
          {/* Small vertical band on the left of the map */}
          <div style={{ width: "10px", height: "100vh" }} />

          <div
            style={{
              flex: "1 1 auto",
              position: "relative",
              maxHeight: "99.9%",
              boxShadow: "0px 0px 10px "
            }}
          >
            <CommandPanel
              heightNav={heightNav}
              parameter={parameter}
              threeD={threeD}
              scale3D={scale3D}
              opacity={opacity}
              showStation={showStation}
              mapStyle={mapStyle}
              time={time}
              setTime={this.setTime}
              change={this.change}
              hasLoaded={hasLoaded}
            />

            <Map
              parameter={parameter}
              threeD={threeD}
              scale3D={scale3D}
              setTime={this.setTime}
              time={time}
              change={this.change}
              opacity={opacity}
              showStation={showStation}
              mapStyle={mapStyle}
            />

            <ShowTime
              height={heightNav + 5}
              time={time}
              updateTime={this.updateTime}
            />
            <ShowMeasures
              station={clickedStation}
              change={this.change}
              showGraphs={showGraphs}
            />
          </div>
          <WelcomeModal showModal={showModal} change={this.change}/>
          {/* Small vertical band on the right of the map */}
          <div style={{ width: "10px", height: "100vh" }} />
        </div>
        {showGraphs && clickedStation && (
          <Graphs
            clickedStation={clickedStation}
            heightNav={heightNav}
            change={this.change}
          />
        )}
      </>
    );
  }
}

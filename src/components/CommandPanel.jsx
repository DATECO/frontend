import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "styled-components/macro";

import { Button } from "./HomePageComponents.jsx";
import parseDate from "../utils/date";
import { PARAMS_W_ALT as PARAMS, URL } from "../utils/constants";

import infologo from "../img/information.svg";

const texts = {
  parameter: 'Change the parameter used in the heatmap.',
  time: 'Choose the measurement time (some dates might be unavailable).',
  threeD: 'Display the heatmap in 3D using the altitude of the stations (use [Ctrl/Cmd]+mouse to change perspective on map).',
  opacity: 'Change the opacity of the heatmap.',
  stations: 'Show the black markers indicating the stations location.',
  style: 'Change the color style of the map.'
}

const ContainerAll = styled.div`
  position: absolute;
  top: ${props => props.heightNav}px;
  left: 5px;
  width: 20%;
  min-width: 200px;
  height: 40%;
  z-index: 10000;
  pointer-events: ${props => (props.show ? "auto" : "none")};
`;

ContainerAll.propTypes = {
  heightNav: PropTypes.number
};

const ContainerSettings = styled.div`
  background-color: hsla(0, 0%, 99%, 90%);
  color: hsl(0, 0%, 20%);
  z-index: 10000;
  box-shadow: 0px 1px 5px hsl(0, 0%, 50%);
  border-radius: 5px;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: 0.2s ease-out;
  padding: 5px 10px;
  font-size: 16px;
`;

ContainerSettings.propTypes = {
  show: PropTypes.bool
};

const ShowSettingsButton = styled(Button)`
  margin: 5px;
  font-size: 16px;
  padding: 5px 10px;
  font-weight: 600;
  pointer-events: auto;
  opacity: ${props => (props.hasLoaded ? 1 : 0)};
  transition: 0.2s;
`;

const HeaderParameter = styled.p`
  font-weight: 600;
`;

const Info = ({ text }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <span style={{position:'relative'}} onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
      <img
        src={infologo}
        alt="info"
        width="16px"
        height="16px"
        style={{ verticalAlign: "baseline"}}
      />
      {showInfo && <InfoSpan text={text} />}
    </span>
  );
};

const InfoSpan = ({ text }) => (
  <span
    style={{
      display: 'inline-block',
      background: "hsl(0,0%,20%)",
      color: "white",
      opacity: 0.9,
      position: "absolute",
      zIndex: 10000,
      left: "8px",
      bottom: "8px",
      padding: "5px",
      fontWeight:400,
      fontSize: '14px',
      width: '100vw',
      maxWidth: '20vw',
    }}
  >
    {text}
  </span>
);

class CommandPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      date: "",
      time: "",
      error: false
    };
    this.changeDate = this.changeDate.bind(this);
  }

  componentDidMount() {
    // Get the last date available in backend to display as default in datetime picker.

    fetch(URL+"api/lastdate/")
      .then(res => res.json())
      .then(res => {
        const parsed = parseDate(new Date(res.time + "Z"));
        this.setState({ date: parsed[0], time: parsed[1] });
      });
  }

  changeDate() {
    // Set the date to the value specified in the datetime input.
    // Checks if value is available in backend. If yes, sets it in the parent component
    // using the setTime method, otherwise show the error message.

    const epoch =
      new Date(this.state.date + "T" + this.state.time).getTime() / 1000;
    fetch(URL+`api/measures/?start=${epoch}&end=${epoch}`)
      .then(res => res.json())
      .then(res => {
        if (res.length > 0) {
          this.props.setTime(this.state.date + "T" + this.state.time, false);
          this.setState({ error: false });
        } else {
          this.setState({ error: true });
        }
      });
  }

  render() {
    const {
      parameter,
      threeD,
      scale3D,
      opacity,
      showStation,
      mapStyle,
      change,
      hasLoaded
    } = this.props;

    const [maxDate, maxTime] = parseDate(new Date());
    const paramList = PARAMS;

    return (
      <ContainerAll
        heightNav={this.props.heightNav + 5}
        show={this.state.showSettings}
      >
        <ShowSettingsButton
          hasLoaded={hasLoaded}
          primary
          onClick={() =>
            this.setState(prev => ({ showSettings: !prev.showSettings }))
          }
        >
          Settings
        </ShowSettingsButton>

        <ContainerSettings show={this.state.showSettings}>
          <HeaderParameter>
            Parameter <Info text={texts.parameter} />
          </HeaderParameter>
          <Dropdown
            options={paramList}
            onChange={e => change("parameter", e.value)}
            value={parameter}
            placeholder={parameter}
          />

          <HeaderParameter>Measurement time <Info text={texts.time} /></HeaderParameter>
          <div>
            <input
              type="date"
              id="measurement-date"
              name="measurement-date"
              value={this.state.date}
              min="2019-01-01"
              max={maxDate}
              onChange={e => this.setState({ date: e.currentTarget.value })}
            />

            <input
              type="time"
              id="measurement-type"
              name="measurement-date"
              value={this.state.time}
              min="00:00"
              max={maxTime}
              step="600"
              onChange={e => this.setState({ time: e.currentTarget.value })}
            />
            <div>
              <button onClick={this.changeDate}>Set time</button>
              <span style={{ marginLeft: "5px", color: "red" }}>
                {this.state.error ? "Not available" : ""}
              </span>
            </div>
          </div>

          <HeaderParameter>3D <Info text={texts.threeD} /></HeaderParameter>
          <div>
            <input
              type="radio"
              value="yes"
              checked={threeD}
              onChange={e => change("threeD", e.currentTarget.value === "yes")}
            />
            Yes
            <input
              type="radio"
              value="no"
              checked={!threeD}
              onChange={e => change("threeD", e.currentTarget.value === "yes")}
            />
            No
            <input
              css={`
                opacity: ${threeD ? 1 : 0};
              `}
              type="range"
              min="1"
              max="50"
              value={scale3D}
              onChange={e => change("scale3D", parseInt(e.currentTarget.value))}
              step="1"
              disabled={!threeD}
            />
          </div>

          <HeaderParameter>Opacity <Info text={texts.opacity} /></HeaderParameter>
          <div>
            <input
              type="range"
              min="0"
              max="255"
              value={opacity}
              onChange={e => change("opacity", parseInt(e.currentTarget.value))}
              step="1"
            />
          </div>

          <HeaderParameter>Show stations <Info text={texts.stations} /></HeaderParameter>
          <div>
            <input
              type="radio"
              value="yes"
              checked={showStation}
              onChange={e =>
                change("showStation", e.currentTarget.value === "yes")
              }
            />
            Yes
            <input
              type="radio"
              value="no"
              checked={!showStation}
              onChange={e =>
                change("showStation", e.currentTarget.value === "yes")
              }
            />
            No
          </div>

          <HeaderParameter>Map style <Info text={texts.style} /></HeaderParameter>
          <div>
            <input
              type="radio"
              value="light"
              checked={mapStyle === "light"}
              onChange={e => change("mapStyle", e.currentTarget.value)}
            />
            Light
            <input
              type="radio"
              value="dark"
              checked={mapStyle === "dark"}
              onChange={e => change("mapStyle", e.currentTarget.value)}
            />
            Dark
            <input
              type="radio"
              value="basic"
              checked={mapStyle === "basic"}
              onChange={e => change("mapStyle", e.currentTarget.value)}
            />
            Basic
          </div>
        </ContainerSettings>
      </ContainerAll>
    );
  }
}

CommandPanel.propTypes = {
  // Height of NavBar, used to display other stuff below NavBar.
  heightNav: PropTypes.number,
  // Parameter to display (e.g temperature, pressure,...)
  parameter: PropTypes.string,
  // If true, give z-coordinate to triangles corresponding to altitude.
  threeD: PropTypes.bool,
  // Gives the scale of the z-coordinates. More high it is, more high are peaks in map.
  scale3D: PropTypes.number,
  // Opacity of the map.
  opacity: PropTypes.number,
  // If true, show the station in the ScatterPlot layer.
  showStation: PropTypes.bool,
  // Map style (light, dark or basic).
  mapStyle: PropTypes.string,
  // Time at which to display the data.
  time: PropTypes.instanceOf(Date),
  // Function to set time in parent component.
  setTime: PropTypes.func,
  // Set state in parent component on given state parameter.
  change: PropTypes.func
};

export default CommandPanel;

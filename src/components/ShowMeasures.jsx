import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import { UNITS } from '../utils/constants';

const ContainerAll = styled.div`
  position: absolute;
  bottom: 15px;
  right: 5px;
  z-index: 10000;
  background-color: hsla(0, 0%, 99%, 90%);
  color: hsl(0, 0%, 20%);
  box-shadow: 0px 1px 5px hsl(0, 0%, 50%);
  border-radius: 5px;
  opacity: ${props => (props.show ? 1 : 0)};
  transform: ${props => (props.show ? "scale(1)" : "scale(0)")};
  transition: 0.2s;
  padding: 5px 10px;
  font-size: 16px;
  pointer-events: none;
`;

const CloseDiv = styled.div`
  position: absolute;
  font-size: 20px;
  top: 2px;
  right: 5px;
  pointer-events: auto;
  transition: 0.2s;
  :after {
    display: inline-block;
    content: "\00d7"; /* This will render the 'X' */
  }
  :hover {
    color: red;
  }
`;

const ContainerMeasures = styled.div`
  margin: 10px 0px;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: hsl(0, 0%, 10%);
  margin-right: 8px;
`;

const Button = styled.button`
  margin: -5px auto 5px;
  font-size: 16px;
  padding: 5px 10px;
  background-color: white;
  font-weight: 500;
  pointer-events: auto;
  border: 2px solid ${props => props.color || 'hsl(200, 100%, 50%)'};
  border-radius: 5px;
  box-shadow: 0px 5px 5px hsla(0, 0%, 0%, 0.1);
  :hover {
    background-color: ${props => props.color || 'hsl(200, 100%, 50%)'};
    color: white;
  }
  transition: 0.2s;
`;
Button.propTypes = {
  color: PropTypes.string
}

const GraphButton = ({ onClick }) => (
  <div style={{ display: "flex", textAlign: "center", alignItems: "center" }}>
    <Button onClick={onClick}>Graphs</Button>
  </div>
);

const ShowMeasures = ({ station, change, showGraphs }) => {
  let show = station.name;

  const parameters = [
    ["altitude", "Altitude"],
    ["temperature", "Temperature"],
    ["pressure_altitude", "Pressure at station"],
    ["pressure_qnh", "Adjusted pressure"],
    ["wind_mean_speed", "Mean wind speed"],
    ["wind_max_speed", "Max wind speed"],
    ["humidity", "Humidity"],
    ["rain", "Precipitation"]
  ];

  return (
    <ContainerAll show={show}>
      <CloseDiv onClick={() => {change("clickedStation", {});change("showGraphs", false);}} />
      <Header>{station.name}</Header>
      {parameters
        .filter(p => station[p[0]] !== null)
        .map(p => (
          <ContainerMeasures key={p[0]}>
            <div>{p[1]}</div>
            <div>
              {station[p[0]]} {UNITS[p[0]]}
            </div>
          </ContainerMeasures>
        ))}

      {show && <GraphButton onClick={() => {
        if (showGraphs) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else {
          change("showGraphs", true);}
      }} /> }
    </ContainerAll>
  );
};

export { Button };
export default ShowMeasures;

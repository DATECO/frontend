import React, { Component } from "react";
import DisplayWeather from "./DisplayWeather.jsx";
import styled, { css } from 'styled-components/macro';

class Weather extends Component {
  constructor(props) {
    super(props);
    this.zeroCelsius = 273.15;
    this.state = {
      weather: {}
    };
    this.APIKEY = "f313cd5b73a7948788f68d2ca373e968";

    this.getWeatherFromCity = this.getWeatherFromCity.bind(this);
  }

  getWeatherFromCity() { 
    let cityId = this.props.city.id;
    const url = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${
      this.APIKEY
    }`;

    fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        this.setState({ weather: data });
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      this.getWeatherFromCity();
    }
  };

  componentDidMount() {
    this.getWeatherFromCity();
  }

  render() {
    return (
      <DisplayWeather className={this.props.className} weather={this.state.weather} />
    );
  }
}

// const StyledWeather = styled(Weather)`
//   flex-basis: auto;
//   flex-grow: 4;
//   font-size: 2em;
//   background: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);
//   color: white;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   grid-template-rows: 2fr 1fr 2fr;
//   grid-template-areas:
//   "city icon"
//   "date icon"
//   "temperature icon";
// ` 
const StyledWeather = styled(Weather)`
  float: right;
  position:absolute;
  left: 30%;
  height:100%;
  width: 70%;
  font-size: 2em;
  /* background: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%); */
  color: white;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr 2fr;
  grid-template-areas:
  "city icon"
  "date icon"
  "temperature icon";
  transition: 0.2s;
  ${props => !props.showNav && css`
    left: 0%;
    width: 100%;
  `}
` 

export default StyledWeather;
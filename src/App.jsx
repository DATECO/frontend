import React, { Component } from "react";
import Weather from "./components/Weather.jsx";
import CitySelection from "./components/CitySelection.jsx";
import Graph from "./components/Graph.jsx";
import * as Constants from "./utils/constants";
import getClosest from "./utils/distances"
import styled, {createGlobalStyle} from "styled-components/macro";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto|Ubuntu');
  body {
    padding: 0;
    margin: 0;
    font-family: Ubuntu, sans-serif;
  }
`

// const AppWrapper = styled.div`
//   text-align: center;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
//   align-items: stretch;
//   height: 100vh;
// `;
const AppWrapper = styled.div`
  text-align: center;
  height: 100vh;
`;

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      cities: Constants.INITIAL_CITIES,
      city: 0,
      lat:0,
      lon:0,
      displayInputs: false,
      showNav: false,
      showGraph: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.addCity = this.addCity.bind(this);
    this.getCity = this.getCity.bind(this);
    this.setLatLon = this.setLatLon.bind(this);
    this.toggleInputs = this.toggleInputs.bind(this);
    this.addCityFromCity = this.addCityFromCity.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.toggleGraph = this.toggleGraph.bind(this);
  }

  handleChange(event, keyEvent) {
    let placeHolder = keyEvent==='city' ? 0 : '';
    let attr = keyEvent==='city' ? 'name' : 'value'; 
    this.setState({[keyEvent]: parseFloat(event.target[attr]) || placeHolder});
    if (keyEvent==='city') {
      let newCity = this.state.cities[this.state.city]
      this.setLatLon(newCity.coord.lat,newCity.coord.lon);
    }
  }

  addCity(event) {
    // let newCity = this.getCity()
    // let newCities = this.state.cities;
    // newCities.push(newCity);
    // console.log(newCities);
    // this.setState({cities: newCities,city:newCities.length-1});
    this.addCityFromCity(this.getCity());
    event.preventDefault();
  }

  addCityFromCity(city) {
    let newCities = this.state.cities;
    newCities.push(city);
    this.setState({cities: newCities,city:newCities.length-1, lat: city.coord.lat, lon:city.coord.lon});
  }

  setLatLon(lat,lon) {
    this.setState({lat:lat,lon:lon});
  }

  getCity() {
    let newCity = null;
    let { lat, lon } = this.state;
    newCity = getClosest(lat, lon);

    return newCity;
  }

  toggleInputs() {
    this.setState({displayInputs:!this.state.displayInputs});
  }

  toggleNav() {
    this.setState({showNav:!this.state.showNav});
  }

  toggleGraph() {
    this.setState({showGraph:!this.state.showGraph});
  }

  render() {
    return (
      <AppWrapper>

        <GlobalStyles />

        <CitySelection 
        cities={this.state.cities} 
        city={this.state.city}
        handleChange={this.handleChange} 
        addCity={this.addCity}
        setLatLon={this.setLatLon}
        toggleInputs={this.toggleInputs}
        displayInputs={this.state.displayInputs}
        addCityFromCity={this.addCityFromCity}
        showNav={this.state.showNav}
        toggleNav={this.toggleNav}
        toggleGraph={this.toggleGraph}
        />


        <Weather
        city={this.state.displayInputs?this.getCity():this.state.cities[this.state.city]} 
        showNav={this.state.showNav}
        />

        {this.state.showGraph &&
          <Graph />
        }

      </AppWrapper>
    );
  }
}

export default App;

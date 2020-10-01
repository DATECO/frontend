import React, { Component } from 'react';
import styled, { css } from 'styled-components/macro';
import Menu from "./Menu.jsx";
import CityInputs from "./CityInputs.jsx";
import LocationPicker from "./LocationPicker.jsx";
import CitySearch from "./CitySearch.jsx";

class CitySelection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city: 0,
      lat: '',
      lon: '',
      showMap: false
    }
    this.parseChange = this.parseChange.bind(this);
  }

  parseChange(event, keyEvent) {
    this.props.handleChange(event,keyEvent);
    let placeHolder = keyEvent==='city' ? 0 : '';
    let attr = keyEvent==='city' ? 'name' : 'value'; 
    this.setState({[keyEvent]: parseFloat(event.target[attr]) || placeHolder});
  }


  

  render() {
    let options = this.props.cities.map((c,i) => {
      return <option  key={c.name} value={i}>{c.name}</option>
    });
    options.push(
      <option key='other' value={this.props.cities.length}>Other</option>
    );

    return (
      <div className={this.props.className}>

        <button
        onClick={this.props.toggleNav} 
        style={{
          position: "absolute",
          left:'100%',
          height: '80px',
        }}>
        {this.props.showNav?
        'Close side bar':
        'Pick another city'}
        </button>

        <button
        onClick={this.props.toggleGraph} 
        style={{
          position: "absolute",
          height: '80px',
          left:'100%',
          top: '80px',
        }}>
        {this.props.showGraph?
        'Close side bar':
        'Show historical data'}
        </button>

        <Menu 
        cities={this.props.cities} 
        city={this.props.city} 
        parseChange={this.parseChange}
        toggleInputs={this.props.toggleInputs}
        displayInputs={this.props.displayInputs}
        />


        <CityInputs parseChange={this.parseChange} addCity={this.props.addCity}
          toggleInputs={this.props.toggleInputs} displayInputs={this.props.displayInputs}/>


        <LocationPicker 
        setLatLon={this.props.setLatLon}
        addCity={this.props.addCity} 
        displayInputs={this.props.displayInputs}
        toggleInputs={this.props.toggleInputs}
        />

        <CitySearch 
        addCityFromCity={this.props.addCityFromCity}
        />
        
      </div>

    )
  }
}

// const StyledCitySelection = styled(CitySelection)`
//   flex-basis: 30%;
//   flex-grow: 1;
//   font-size: 1em;
//   background: rgb(100,100,100);
//   transition: 2s;
//   min-width:30%;
//   ${props => !props.showNav && css`
//     flex: 0 0;
//     min-width: 0;
//   `}
// `
const StyledCitySelection = styled(CitySelection)`
  z-index:1000;
  position: relative;
  font-size: 1em;
  background: rgb(100,100,100);
  width: 30%;
  height:100vh;
  float: left;
  transition: 0.2s;
  ${props => !props.showNav && css`
    transform: translateX(-100%);
  `}
`

export default StyledCitySelection;
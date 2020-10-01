import React from "react";
import styled from 'styled-components/macro';

const WeatherProperty = styled.div.attrs( props => ({
  style:{gridArea: `${props.place}`}
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 1000;
  font-size: 1.5em;
`

export default function DisplayWeather(props) {
  const w = props.weather;
  const zeroCelsius = 273.15;
  return(
  <div className={props.className}>

    <WeatherProperty place='city'>
      {w.city && w.city.name} 
    </WeatherProperty>

    <WeatherProperty place='temperature'>
      {w.list && (w.list[0].main.temp-zeroCelsius).toFixed(1)} °C <br />
    </WeatherProperty>

    <WeatherProperty place='date'>
      {w.list && (new Date(1000*w.list[0].dt)).toLocaleString('en-CH')}
    </WeatherProperty>

    <WeatherProperty place='icon'>
      <img src={require('../img/wi-day-sleet-storm.svg')} alt='icon' style={{width:'95%'}}/>
    </WeatherProperty>

    {/* <div style={{
      gridArea:'icon',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
      }}>
      <img src={require('../img/wi-day-sleet-storm.svg')} alt='icon' />
    </div>  */}
  </div>
  );
}

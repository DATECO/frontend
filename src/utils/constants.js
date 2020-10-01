const COLOR_MAP = {
  jet: require('../data/jetcolormap.json'),
  coolwarm: require('../data/coolwarmcolormap.json'),
  plasma: require('../data/plasmacolormap.json'),
}

const UNITS = {
  'temperature': '°C',
  'pressure_altitude': 'hPa',
  'pressure_qnh': 'hPa',
  'humidity': '%',
  'wind_mean_speed': 'km/h',
  'wind_max_speed': 'km/h',
  'rain': 'mm',
  'altitude': 'm'
}

const PARAMS = [
  {value:'temperature', label: 'Temperature'},
  {value:'pressure_altitude', label: 'Pressure'},
  {value:'pressure_qnh', label: 'Adjusted Pressure'},
  {value:'humidity', label: 'Humidity'},
  {value:'wind_mean_speed', label: 'Mean wind speed'},
  {value:'wind_max_speed', label: 'Maximum wind speed'},
  {value:'rain', label: 'Precipitation'},
]

const PARAMS_W_ALT = [...PARAMS, {value:'altitude', label: 'Altitude'}];

const PRETTY_PARAMS = {
  temperature: 'Temperature',
  pressure_altitude: 'Pressure',
  pressure_qnh: 'Adjusted Pressure',
  humidity: 'Humidity',
  wind_mean_speed: 'Mean wind speed',
  wind_max_speed: 'Maximum wind speed',
  rain: 'Precipitation',
  altitude: 'Altitude',
}

const TIME_PARAMS = [
  {value: '3600', label: 'Last hour'},
  {value: '86400', label: 'Last day'},
  {value: '604800', label: 'Last week'},
  {value: '2592000', label: 'Last month'},
]

export { COLOR_MAP, UNITS, PARAMS, PARAMS_W_ALT, PRETTY_PARAMS, TIME_PARAMS };


export const URL = 'https://dateco.tk/';


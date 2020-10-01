import React, { Component } from 'react'
import ReactModal from 'react-modal';
import ReactMapGL, {Marker} from 'react-map-gl';
import styled from 'styled-components';

const TOKEN = 'pk.eyJ1Ijoid2lsbGlhbWJvcmdlYXVkIiwiYSI6ImNqcHgzdmp5azBpOTk0M2puZG51ZG5tM2oifQ.JmEQT7uJE0MrIZHIFjRIkg'

const Button = styled.button`
  font-size: 1.5em;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  border: 3px solid black;
  border-radius:20px;
  width: 80%;
  text-align: center;
  background: white;
  padding: 5px;
  transition: 0.2s;
  &:hover {
    background: green;
    color: white;
  }
`

const CancelButton = styled.button`
  font-size: 1.3em;
  border: 3px solid black;
  border-radius:20px;
  text-align: center;
  background: white;
  padding: 4px;
  transition: 0.2s;
  float: right;
  &:hover {
    background: red;
    color: white;
  }
`
const ConfirmButton = styled.button`
  font-size: 1.3em;
  margin-top:1em;
  margin-left: auto;
  margin-right: auto;
  border: 3px solid black;
  border-radius:20px;
  text-align: center;
  background: white;
  padding: 4px;
  transition: 0.2s;
  &:hover {
    background: green;
    color: white;
  }
`

const Ball = styled.div`
  transform:translate(-0.5em,-0.5em);
  background:red;
  width:1em;
  height:1em;
  border-radius:1em;
` 

export default class LocationPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMap: false,
      clicked: false,
      viewport: {
        width: '100%',
        height: '80%',
        latitude: 46.5197,
        longitude: 6.6323,
        zoom: 3
        }
    };

    this._onClickMap = this._onClickMap.bind(this);
    this.confirmLocation = this.confirmLocation.bind(this);
    this.handleOpenMap = this.handleOpenMap.bind(this);
    this.handleCloseMap = this.handleCloseMap.bind(this);
  }

  handleOpenMap () {
    if (this.props.displayInputs){
      this.props.toggleInputs();
    }
    this.setState({ showMap: true });
  }
  
  handleCloseMap () {
    this.setState({ showMap: false });
  }

  _onClickMap(map, evt) {
    let lngLat = map.lngLat;
    this.setState({clicked:true,lon:lngLat[0],lat:lngLat[1]});
    this.props.setLatLon(lngLat[1],lngLat[0]);
  }

  confirmLocation(event) {
    this.props.addCity(event);
    this.handleCloseMap();
  }

  render() {
    return (
    <>
      <Button onClick={this.handleOpenMap}>Pick on Map</Button>
      <ReactModal 
        isOpen={this.state.showMap}
        contentLabel="Minimal Modal Example"
        ariaHideApp={false}
      >

        <div style={{marginBottom:'2em'}}>
          <span style={{fontSize:'1.3em'}}>Pick a location on the map</span>
          <CancelButton onClick={this.handleCloseMap}>Cancel</CancelButton>
        </div>

        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={TOKEN} 
          onClick={this._onClickMap} >
          {this.state.clicked &&
            <Marker latitude={this.state.lat} longitude={this.state.lon}>
              <Ball />
            </Marker>
          }
        </ReactMapGL>
        <div style={{textAlign:'center'}}>
        <ConfirmButton onClick={this.confirmLocation}>Confirm</ConfirmButton>
        </div>
      </ReactModal>
    </>
    )
  }
}



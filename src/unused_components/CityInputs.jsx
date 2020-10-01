import React, { Component } from 'react'
import styled from 'styled-components'

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

export default class CityInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      lon: ''
    }
    
    this.parseChange = this.parseChange.bind(this);
    this.submitButton = this.submitButton.bind(this);
  }

  parseChange(event, keyEvent) {
    this.props.parseChange(event,keyEvent);
    let placeHolder ='';
    let attr = 'value'; 
    this.setState({[keyEvent]: parseFloat(event.target[attr]) || placeHolder});
  }

  submitButton(event) {
    event.preventDefault()
    this.props.addCity(event);
    this.props.toggleInputs();
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.toggleInputs}>Coordinates</Button>
        {this.props.displayInputs && 
        <form>
          <label>Lattitude:</label>
          <div>
            <input 
            type="number" 
            value={this.state.lat} 
            placeholder="Lattitude" 
            onChange={event => this.parseChange(event,'lat')}
            />
          </div>
          <label>Longitude:</label>
          <div>
            <input
            type="number"
            value={this.state.lon} 
            placeholder="Longitude" 
            onChange={(event) => this.parseChange(event,"lon")}
            />
          </div>
          <div>
            <button onClick={this.submitButton}>Add city</button>
          </div>
        </form>
        }
      </div>
    )
  }
}
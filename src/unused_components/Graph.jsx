import React, { Component } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines,
        XAxis, YAxis, makeWidthFlexible} from 'react-vis';
import Select from 'react-select';


class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stations: [],
      station: -1,
      data: []
    }
    this.fetchStations = this.fetchStations.bind(this);
    this.fetchMeasures = this.fetchMeasures.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  fetchStations() {
    // Fetch backend for list of available stations.
    fetch('http://nitrogenweather.pythonanywhere.com/api/stations/')
      .then(res => res.json())
      .then(res => res.map(x => {
        return {
          label: x.name,
          value: x.id
        }
      }))
      .then(res => this.setState({stations: res}))
      .catch(err => console.error(err));
  }

  fetchMeasures(station) {
    // Fetch backend for measures on the selected station.
    fetch(`http://nitrogenweather.pythonanywhere.com/api/measures/?station=${station}`)
      .then(res => res.json())
      .then(res => res.filter(x => (x.time>"2019-01-13")))
      .then(res => res.map(x => {
        return {
          x: Date.parse(x.time),
          y: x.temperature
        }
      }))
      .then(res => this.setState({data:res}))
      .catch(err => console.error(err));
  }

  updateGraph(opt) {
    this.setState({station: opt.value});
    this.fetchMeasures(opt.value);
  }

  componentDidMount(){
    this.fetchStations();
    if (this.state.station != -1) {
      this.fetchMeasures()
    }
  }
  
  render() {
    const FlexibleXYPlot = makeWidthFlexible(XYPlot);

    return (
      <div className="App" style={{height:'100%',width:'90%', margin:'0 auto'}}>

        <FlexibleXYPlot xType="time" height={500}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          <LineSeries data={this.state.data} />
        </FlexibleXYPlot>

        <Select 
          options={this.state.stations} 
          onChange={this.updateGraph}
        />

      </div>
    );
  }
}

export default Graph;
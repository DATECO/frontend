import React, { Component } from 'react'
import { geoPath, geoMercator } from 'd3-geo';
import { select } from 'd3-selection';
import { feature, mesh } from "topojson-client";

export default class Platform extends Component {
  constructor(props) {
    super(props);
    this.state = {mapData: []}
  }

  componentDidMount() {
    var mapData = require('./data/ch.json');
    const country = feature(mapData, mapData.objects.country);
    const cantonBoundaries = mesh(mapData, mapData.objects.cantons, function(a, b) { return a !== b; });
    const municipalityBoundaries = mesh(mapData, mapData.objects.municipalities, function(a, b) { return a !== b; });
    this.setState({country, cantonBoundaries, municipalityBoundaries})
  }


  render() {
    // const width = 960;
    // const height = 500;
 
    // var path = path()
    //   .projection(null);
  
    // var svg = select("body").append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
  
    // d3.json("ch.json", function(error, ch) {
    //   svg.append("path")
    //     .datum(feature(ch, ch.objects.country))
    //     .attr("class", "country")
    //     .attr("d", path);
    // });
  
    // //   svg.append("path")
    // //     .datum(mesh(ch, ch.objects.municipalities, function(a, b) { return a !== b; }))
    // //     .attr("class", "municipality-boundaries")
    // //     .attr("d", path);
  
    // //   svg.append("path")
    // //     .datum(mesh(ch, ch.objects.cantons, function(a, b) { return a !== b; }))
    // //     .attr("class", "canton-boundaries")
    // //     .attr("d", path);
    // // });
    const {country, cantonBoundaries, municipalityBoundaries} = this.state;
    return (
      // <div>
      //   Hello
      // </div>
      <svg width={ 960 } height={ 500 } >
        <path d={geoPath().projection(null)(country)} 
         stroke='red' />
        <path d={geoPath().projection(null)(cantonBoundaries)} 
         stroke='red' />
        <path d={geoPath().projection(null)(municipalityBoundaries)} 
         stroke='red' />
        <circle
            cx={ 437 }
            cy={ 254 }
            r={ 10 }
            fill="#00F"
          />
        {/* <g className="countries">
          {
            this.state.mapData.map((d,i) => (
              <path
                key={ `path-${ i }` }
                d={geoPath().projection(null)(d)}
                className="country"
                fill={ `rgba(38,50,56,${1 / this.state.mapData.length * i})` }
                stroke="#FFFFFF"
                strokeWidth={ 0.5 }
              />
            ))
          }
        </g> */}
      </svg>
    );
  }
}

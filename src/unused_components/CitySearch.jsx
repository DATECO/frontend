import React, { Component } from "react";
import Autocomplete from "react-autocomplete";
import styled from "styled-components";

const Dropdown = styled.div`
  overflow: auto;
  position: absolute;
  width: 80%;
  left:10%;
  max-height: 300px;
  font-size: 20px;
`;

const inputStyle = {
  'fontSize': '1.3em',
  'borderRadius':'20px',
  'padding': '10px',
  'textAlign':'center',
  'border': '3px solid black',
  'marginLeft': 'auto',
  'marginRight': 'auto',
  'marginTop': '10%',
  'width': '80%'
}


export default class CitySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: require('../data/city.list.json'),
      data: [],
      value: ""
    };
    this.shouldItemRender = this.shouldItemRender.bind(this);
    this.sortItems = this.sortItems.bind(this);
    this.isSubstringOf = this.isSubstringOf.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }


  retrieveData(value) {
    let data = require("../data/city.list.json");
    data = data.filter(item => this.isSubstringOf(value, item.name));
    if (data.length < 1000) {
      this.setState({ data: data });
    } else {
      this.setState({ data: [] });
    }
  }

  isSubstringOf(a, b) {
    let match = b.toLowerCase().indexOf(a.toLowerCase());
    return match < 2 && match !== -1;
  }

  shouldItemRender(item) {
    return this.isSubstringOf(this.state.value, item.name);
  }

  sortItems(a, b, value) {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    const valueLower = value.toLowerCase();
    const queryPosA = aLower.indexOf(valueLower);
    const queryPosB = bLower.indexOf(valueLower);
    if (queryPosA !== queryPosB) {
      return queryPosA - queryPosB;
    }
    return aLower < bLower ? -1 : 1;
  }

  onChange(event, value) {
    this.setState({ value: value });
    this.retrieveData(value);
  }

  onSelect(value, item) {
    this.setState({ value: '' });
    this.props.addCityFromCity(item);
  }

  render() {
    return (
      <Autocomplete
        inputProps={{style:inputStyle,
          id:'city-search',placeholder: 'Search for a city',
          className:this.props.className}}
        value={this.state.value}
        wrapperStyle={{ position: "relative", display: "inline-block" }}
        items={this.state.data}
        getItemValue={item => item.name}
        shouldItemRender={this.shouldItemRender}
        sortItems={this.sortItems}
        onChange={this.onChange}
        onSelect={this.onSelect}
        renderMenu={children => <Dropdown>{children}</Dropdown>}
        renderItem={(item, isHighlighted) => (
          <div
            style={{ background: isHighlighted ? "lightgray" : "white" }}
            key={item.id}
          >
            {item.name}
          </div>
        )}
      />
    );
  }
}

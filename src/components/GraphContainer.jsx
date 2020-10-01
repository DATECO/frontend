import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import GraphComp from "./Graphs.jsx";
import { Button } from "./ShowMeasures.jsx";
import { PARAMS, URL, TIME_PARAMS } from "../utils/constants";

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: ${props =>
    props.height ? "calc(79vh - " + props.height + "px)" : "100vh"};
  max-width: 100%;
  max-height: 50vw;
  margin-top: ${props => props.height || 0}px;
  margin-bottom: ${props => props.height || 0}px;
`;

ContainerDiv.propTypes = {
  // Height of NavBar
  height: PropTypes.number
};

const styles = {
  paramColumn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0px 30px"
  },
  stationName: {
    fontSize: 25,
    fontWeight: 500,
    color: "hsl(0,0%,10%)",
    margin: "10px 0px"
  },
  timeInterval: {
    color: "hsl(0, 0%, 20%)",
    fontWeight: 700,
    margin: "10px 0px"
  },
  firstParam: {
    color: "hsl(27, 70%, 52%)",
    fontWeight: 700,
    margin: "10px 0px"
  },
  secondParam: {
    color: "hsl(133, 41%, 41%)",
    fontWeight: 700,
    margin: "10px 0px"
  },
  button: {
    marginTop: "20px"
  }
};

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      minmax: {},
      parameterL: "",
      parameterR: "",
      okParams: [],
      showR: true,
      timeInterval: 86400,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    if (this.props.clickedStation.station) {
      this.fetchData();
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevProps.clickedStation ||
      prevProps.clickedStation.station !== this.props.clickedStation.station
    ) {
      this.fetchData();
      this.setState({ showR: true });
    }
    if(prevState.timeInterval !== this.state.timeInterval) {
      this.fetchData();
    }
  }

  fetchData() {
    // Fetch data to plot

    const { clickedStation: station } = this.props;
    const { timeInterval } = this.state;
    const time = Math.round((new Date()).getTime() / 1000);
    const station_id = station.station;
    // Fetch for timeInterval duration. If more than one day, fetch hourly measures.
    const apiEndPoint = timeInterval>86400 ? 'hourlymeasures' : 'measures';
    const url = URL+`api/${apiEndPoint}/?station=${station_id}&start=${time -
      timeInterval}&end=${time}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        res.forEach(x => {
          x.time = new Date(x.time + "Z"); // Convert to Date object.
        });
        // minmax contains min and max for each parameter. Allows to rescale data to [0,1].
        const minmax = {};
        PARAMS.forEach(p => {
          minmax[p.value] = [
            Math.min(
              ...res.filter(d => d[p.value] !== null).map(d => d[p.value])
            ),
            Math.max(
              ...res.filter(d => d[p.value] !== null).map(d => d[p.value])
            )
          ];
          const [a, b] = minmax[p.value];
          // If a or b is infinite (eg a=Math.min()) replace by [-0.1,0.1].
          if (!isFinite(a) || !isFinite(b)) {
            minmax[p.value] = [-0.1, 0.1];
          }
          // If a==b (eg constant precipitation), replace by extended values (to avoid divison by 0).
          if (a === b) {
            minmax[p.value] = [
              a - 0.1 * Math.abs(a + 1),
              b + 0.1 * Math.abs(b + 1)
            ];
          }
        });
        return [res, minmax];
      })
      .then(([data, minmax]) => {
        // okParams contains params available at this station.
        const okParams = PARAMS.filter(p => data[0][p.value] !== null);
        // Pick first two available parameters as left and right params.
        const [parameterL, parameterR] = [okParams[0].value, okParams[1].value];
        this.setState({ data, minmax, parameterL, parameterR, okParams });
      });
  }

  render() {
    let { data, minmax, parameterL, parameterR, okParams, showR } = this.state;
    data = data.filter(x => x[parameterL] !== null && x[parameterR] !== null);
    if (!minmax[parameterL] || !minmax[parameterR]) {
      minmax[parameterL] = [-20, 40];
      minmax[parameterR] = [0, 100];
    }
    return (
      <ContainerDiv height={this.props.heightNav}>
        <div style={{ padding: "4px 40px", flexGrow: 1 }}>
          {data[0] && (
            <GraphComp
              data={data}
              parameterL={parameterL}
              parameterR={parameterR}
              minmax={minmax}
              showR={showR}
            />
          )}
        </div>
        <div style={styles.paramColumn}>
          <div style={styles.stationName}>{this.props.clickedStation.name}</div>

          <div style={styles.timeInterval}>Time interval</div>
          <Dropdown
            options={TIME_PARAMS}
            value={this.state.timeInterval.toString()}
            onChange={e => this.setState({timeInterval:parseInt(e.value)})}
          />

          <div style={styles.firstParam}>First parameter</div>
          <Dropdown
            options={okParams}
            onChange={e => this.setState({ parameterL: e.value })}
            value={parameterL}
            placeholder={parameterL}
          />

          <div style={styles.secondParam}>Second parameter</div>
          <Dropdown
            options={[...okParams, { value: "none", label: "None" }]}
            onChange={e => {
              if (e.value === "none") {
                this.setState({ showR: false });
              } else {
                this.setState({ parameterR: e.value, showR: true });
              }
            }}
            value={ showR ? parameterR: 'none'}
            placeholder={parameterR}
          />
          <Button
            color="hsl(0, 70%, 30%)"
            style={styles.button}
            onClick={e => this.props.change("showGraphs", false)}
          >
            Close
          </Button>
        </div>
      </ContainerDiv>
    );
  }
}

Graphs.propTypes = {
  // Height of NavBar.
  heightNav: PropTypes.number,
  // Clicked station on which to display graphs.
  clickedStation: PropTypes.object,
  // Set state in parent component on given state parameter.
  change: PropTypes.func
};

export default Graphs;

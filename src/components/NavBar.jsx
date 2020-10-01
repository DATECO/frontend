import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import LinkButton from "./LinkButton";
import { Logo } from './HomePageComponents.jsx';

import logo from '../img/logo.svg';

const Nav = styled.div`
  width: 100vw;
  margin: 0;
  position: ${props => props.fixed || 'fixed'};
  z-index: 100000;
  top: 0;
  padding: 3px 0px;
  background: hsl(0, 0%, 20%);
  display: flex;
  align-items: center;
  transition: 0.2s;
`;

const NavLogo = styled.div`
  height: 100%;
  flex: 5;
  text-align: center;
  flex-basis: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  padding: 3px 0px 3px;
  transition: all 0.3s ease-in;
  color: hsl(0, 0%, 100%);
  font-size: 18px;
  font-weight: 700;
`;

const NavButton = styled.div`
  height: 100%;
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: baseline;
  padding: 3px 10px;
  transition: all 0.3s ease-in;
`;

const DemoButton = styled(LinkButton)`
  background: ${props => (props.primary ? "hsl(200,100%,50%)" : "white")};
  color: ${props => (props.primary ? "white" : "hsl(200,100%,50%)")};
  font-size: 14px;
  font-weight: 600;
  padding: 2px 4px;
  border: 2px solid hsl(200, 100%, 50%);
  border-radius: 3px;
  cursor: pointer;
`;

DemoButton.propTypes = {
  primary: PropTypes.bool
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleScroll() {
    this.setState({ scroll: window.scrollY });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleClick(route) {
    if (this.props.notHome) {
      this.props.history.push(route);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  render() {
    let dis;
    if (this.state.scroll > this.props.height || this.props.alwaysDisplay) {
      dis = { opacity: 1 };
    } else {
      dis = { opacity: 0.01 };
    }
    if (this.props.demo) {
      return (
        <Nav ref={this.props.addRef} style={dis}>
          <NavLogo >
            <div style={{ cursor: "pointer", width:'100px', maxWidth:'80%', paddingLeft:'10%' }} onClick={()=>this.handleClick('/')}>
              <Logo src={logo}  />
            </div>
          </NavLogo>
          <NavLogo
            style={{
              color: "hsl(200,100%,50%)",
              margin: "0px auto",
              justifyContent: "center",
              fontSize: "24px",
              cursor: 'pointer'
            }}
            onClick={()=>this.props.change('showModal',true)}
          >
            Demo
          </NavLogo>
          <NavLogo style={{ justifyContent: "flex-end" }}>
            <div style={{ cursor: "pointer", paddingRight:'10%'}} onClick={() => this.handleClick('/about')}>
              About
            </div>
          </NavLogo>
        </Nav>
      );
    } else {
      return (
        <Nav ref={this.props.addRef} fixed={this.props.fixed} style={dis}>
          <NavLogo>
            <div style={{ cursor: "pointer", width:'100px', paddingLeft:'10%' }} onClick={()=>this.handleClick('/')}>
              <Logo src={logo}  />
            </div>
          </NavLogo>
          <NavButton>
            <DemoButton to="/demo">Demo</DemoButton>
          </NavButton>
        </Nav>
      );
    }
  }
}

NavBar.propTypes = {
  // Add ref to NavBar to know its height when rendered.
  addRef: PropTypes.func,
  // Height in home page to know when to show the NavBar.
  height: PropTypes.number,
  // If true, always display the NavBar.
  alwaysDisplay: PropTypes.bool,
  // If true, NavBar is not being called from the HomePage.
  notHome: PropTypes.bool,
  // If true, NavBar is being called from the demo page.
  demo: PropTypes.bool,
  // Specify the position of the bar. If not specified, position is fixed.
  fixed: PropTypes.string,
  // Function to change state of Platform component.
  change: PropTypes.func
};

export default withRouter(NavBar);

import React, { Component, Suspense } from "react";
import { createGlobalStyle } from "styled-components/macro";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import {
  AppWrapper,
  FadeInDiv,
  ButtonContainer,
  Button,
  PresentationDivFirst,
  PresentationDivImage,
  PresentationHeader,
  PresentationText,
  Logo
} from "./components/HomePageComponents.jsx";
import NavBar from "./components/NavBar.jsx";
import LinkButton from "./components/LinkButton.jsx";
import homeText from "./content/homePageText";
import Loading from "./components/Loading.jsx";

import "./SwissApp.css";
import mountainIcon from "./img/mountains.svg";
import windmillsIcon from "./img/windmills.svg";
import icebergIcon from "./img/iceberg.svg";
import swissIcon from "./img/switzerlandSmall.png";
import backimageIot from "./img/forestMin.jpg";
import backimageLausanne from "./img/lausanne4.jpg";
import logo from "./img/logo.svg";

const Platform = React.lazy(() => import("./Platform.jsx"));
const About = React.lazy(() => import("./About.jsx"));

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto');
  body {
    padding: 0;
    margin: 0;
    font-family: Roboto, sans-serif;
  };
`;

const colors = {
  lightBlue: "hsl(200,100%,95%)",
  black: "hsl(0,0%,10%)",
  blue: "hsl(200, 100%, 50%)",
  darkBlue: "hsl(220, 20%, 40%)"
};

class SwissApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heightButton: 0,
      backImageLoaded: false
    };
    this.scroll = this.scroll.bind(this);
    this.refAboutUs = React.createRef();
    this.refButton = React.createRef();
    this.refNav = React.createRef();
  }

  componentDidMount() {
    // Set the height of the buttons which will be used to determine if the NavBar is shown or not,
    // since it is shown if the user has scrolled bellow the buttons.
    // Also loads the images and set backImageLoaded to true when it is done. That way, we only
    // display content when the background image has loaded.

    this.setState({
      heightButton:
        this.refButton.current.offsetTop + this.refButton.current.offsetHeight
    });
    let img = new Image();
    img.onload = () => this.setState({ backImageLoaded: true });
    img.src = "/img/backimageMin.jpg";
  }

  scroll(ref) {
    // Scrolls the window to the ref.

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  render() {
    return (
      <AppWrapper>
        <GlobalStyles />
        <NavBar
          addRef={ref => (this.refNav = ref)}
          height={this.state.heightButton}
        />
        <div
          style={{
            background: `url(${"/img/backimageMin.jpg"}) no-repeat center center fixed`,
            height: "100vh",
            backgroundSize: "cover",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <FadeInDiv shouldDisplay={this.state.backImageLoaded}>
            <div
              style={{
                fontSize: "90px",
                fontWeight: 700,
                color: colors.lightBlue,
                width: '600px',
                maxWidth: '80vw'
              }}
            >
              <Logo src={logo} />
            </div>
            <div
              style={{
                // fontSize: "50px",
                fontSize: "calc(30px + (50 - 30) * ((100vw - 300px) / (1600 - 300)))",
                fontWeight: 600,
                color: colors.lightBlue,
                maxWidth: "90vw",
                textAlign:"center",
                marginTop: "20px",
                textShadow: "0 0 10px hsla(0, 0%, 0%, .7)",
              }}
            >
              {homeText.subTitle}
            </div>
          </FadeInDiv>
          <ButtonContainer shouldDisplay={this.state.backImageLoaded}>
            <Button
              ref={this.refButton}
              primary
              onClick={() => {
                this.scroll(this.refAboutUs);
              }}
            >
              About Us
            </Button>
            <Button as={LinkButton} to="/demo">
              Demo
            </Button>
          </ButtonContainer>
        </div>

        <PresentationDivFirst>
          {/* Anchor div for scrolling onClick About Us button so that bottom of navbar is at top of this component.*/}
          <div
            ref={this.refAboutUs}
            style={{
              position: "absolute",
              top: `-${this.refNav.offsetHeight}px`
            }}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={mountainIcon}
              style={{
                height: "100px",
                width: "100px"
              }}
              alt="Mountain icon"
            />
          </div>
          <PresentationHeader color={colors.blue}>
            {homeText.header1}
          </PresentationHeader>
          <PresentationText color={colors.darkBlue}>
            <b>DATECO</b> {homeText.text1}
          </PresentationText>
        </PresentationDivFirst>

        <PresentationDivImage image={backimageIot}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={windmillsIcon}
              style={{
                height: "100px",
                width: "100px",
                margin: "20px 0px 5px 0px"
              }}
              alt="Mountain icon"
            />
          </div>
          <PresentationHeader color={colors.blue}>
            {homeText.header2}
          </PresentationHeader>
          <PresentationText color={colors.lightBlue}>
            {homeText.text2}
          </PresentationText>
        </PresentationDivImage>

        <PresentationDivFirst>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={icebergIcon}
              style={{
                height: "100px",
                width: "100px"
              }}
              alt="Mountain icon"
            />
          </div>
          <PresentationHeader color={colors.blue}>
            {homeText.header3}
          </PresentationHeader>
          <PresentationText color={colors.darkBlue}>
            {homeText.text3}
          </PresentationText>
        </PresentationDivFirst>

        <PresentationDivImage color="white" image={backimageLausanne}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={swissIcon}
              style={{
                height: "100px",
                width: "100px",
                margin: "20px 0px 5px 0px"
              }}
              alt="Mountain icon"
            />
          </div>
          <PresentationHeader color={colors.blue}>
            {homeText.header4}
          </PresentationHeader>
          <PresentationText color={colors.lightBlue}>
            {homeText.text4} <a href="mailto:info@dat.eco" style={{color:'purple'}}><b>info@dat.eco</b></a>.
          </PresentationText>
        </PresentationDivImage>
      </AppWrapper>
    );
  }
}

const RouterApp = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={SwissApp} />
        <Route path="/demo" render={() => <Platform />} />
        <Route path="/about" render={() => <About />} />
      </Switch>
    </Suspense>
  </Router>
);

export default RouterApp;

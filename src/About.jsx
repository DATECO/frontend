import React from 'react';
import { withRouter } from "react-router-dom";

import { GlobalStyles } from "./SwissApp.jsx";
import NavBar from './components/NavBar.jsx';
import { Button } from './components/ShowMeasures.jsx';

const styles = {
  container: {
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    width: '60vw',
    lineHeight: 1.5
  },
  header: {
    fontWeight: 600,
    fontSize: '24px',
    marginTop:'20px'
  },
  title: {
    flex:'1',
    fontWeight:700,
    fontSize: '30px', 
    textAlign:'center',
    color:'hsl(200,100%,50%)'
  },
  parag: {
    flex: '1',
    fontSize: '20px',
    textAlign: 'justify'
   },
  button: {
    flex: '0',
    fontSize: '20px',
    margin: '20px auto 0px',
  }
}

const About = ({history}) => (
  <>
  <GlobalStyles />
  <NavBar alwaysDisplay fixed='static' notHome />
  <div style={styles.container}>
    <div style={styles.title}>About the DATECO demo</div>
    <div style={styles.header}>Data</div>
    <div style={styles.parag}>
      The data comes from our own stations and those of the official automatic monitoring network of MeteoSwiss.
      It is updated at least every 10 minutes.
      The MeteoSwiss network data as well as the altitude data is gotten through <a href='http://www.opendata.swiss'>opendata.swiss</a>.
    </div>
    <div style={styles.header}>Next steps</div>
    <div style={styles.parag}>
      <ul>
        <li>We are deploying more of our own stations to get a finer mesh of the country.</li>
        <li>We are expanding the platform to neighboring countries.</li>
        <li>We are integrating forecasts to the platform.</li>
      </ul>
    </div>
    <div style={styles.header}>Feedback</div>
    <div style={styles.parag}>
      Please send us any feedback at info@dat.eco.
    </div>
    <div style={styles.button}>
      <Button onClick={()=>history.push('/demo')}>
        Back to Demo
      </Button>
    </div>
  </div>
  </>
);

export default withRouter(About);
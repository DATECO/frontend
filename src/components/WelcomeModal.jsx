import React from "react";
import ReactModal from "react-modal";

import { Button } from './ShowMeasures.jsx';

const styles = {
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
    margin: '10px auto 10px',
    textAlign: 'center'
  },
  button: {
    flex: '0',
    fontSize: '20px',
    margin: '0px auto 0px',
  }
}

const WelcomeModal = ({ showModal, change }) => (
  <ReactModal
    style={{
      overlay: { zIndex: 1000000 },
      content: {
        width: "50vw",
        height: "50vh",
        margin: "auto auto",
        background: "hsl(190, 100%, 99%)",
        color: "hsl(0,0%,20%)",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }
    }}
    isOpen={showModal}
    contentLabel="Minimal Modal Example"
    ariaHideApp={false}
  >
    <div style={styles.title}> Welcome to the DATECO demo</div>
    <div style={styles.parag}>
      We provide an analytics platform for real-time environmental data from over 150 weather stations across Switzerland.
    </div>
    <div style={styles.parag}>
      Click on any station to get detailed information, as well as graphs of the last 24 hours of data.
    </div>
    <div style={styles.parag}>
      The map is displayed in 3D! Press Ctrl (Cmd on Mac) and move the map with your mouse to change the 3D perspective.
    </div>
    <div style={{...styles.parag,color:'rgb(216, 0, 12)', fontSize:'14px'}}>
      The demo does not yet work properly on mobile devices. For a better experience, please visit on a computer.
    </div>
    <div style={styles.button}>
      <Button onClick={() => change("showModal", false)}>
        Go to Demo
      </Button>
    </div>
  </ReactModal>
);

export default WelcomeModal;

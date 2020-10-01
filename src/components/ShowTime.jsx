import React from 'react';
import styled from 'styled-components';

import { Button } from './ShowMeasures.jsx'

const ShowTimeContainer = styled.div`
  position: absolute;
  z-index: 10000;
  background-color: hsla(0,0%,99%,90%);
  color: hsl(0,0%,20%);
  box-shadow: 0px 1px 5px hsl(0,0%,50%);
  border-radius: 5px;
  top: ${props => props.height}px;;
  right: 5px;
  padding: 2px 5px;
  font-size: 14px;
  pointer-events: none;
`;

const ModifiedButton = styled(Button)`
  margin: 0px 0px;
  font-size: 14px;
  opacity: ${props => props.show ? 1 : 0};
`;

const TimeDiv = styled.div`
  opacity: ${props => props.show ? 1 : 0};
`;

const ShowTime = ({height, time, updateTime}) => {
  return (
    <ShowTimeContainer height={height}>
      <div style={{color:'hsl(0,0%,10%)',fontWeight:'600'}}>Time of measurements</div>
      <TimeDiv show={time}>{time ? time.toLocaleString('en-ch'): '.'}</TimeDiv>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <ModifiedButton show={time} onClick={updateTime}>
          Refresh
        </ModifiedButton>
      </div>
    </ShowTimeContainer>
  );
}

export default ShowTime;
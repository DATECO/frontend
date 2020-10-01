import styled from 'styled-components';

const ImageHeader = styled.div`
  background: url('/img/backimageMin.jpg') no-repeat center center fixed; 
  @media (max-width: 900px) {
    background-attachment: scroll;
  }
  height: 100vh;
  background-size: cover;
  display: flex;
  flex-direction: column;
`

const AppWrapper = styled.div`
  text-align: center;
`;

const FadeInDiv = styled.div`
  display: 'inline-block';
  opacity: ${props => props.shouldDisplay ? 1 : 0};
  text-shadow: 0 0 50px hsla(0, 0%, 0%, .4);
  flex: 3 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
 
const ButtonContainer = styled.div`
  flex: 2 1 auto;
  display: flex;
  opacity: ${props => props.shouldDisplay ? 1 : 0};
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

const Button = styled.button`
  transition: 0.2s;
  background: ${props => props.primary ? "hsl(200,100%,50%)" : "white"};
  color: ${props => props.primary ? "white" : "hsl(200,100%,50%)"};
  font-size: 20px;
  font-weight: 500;
  margin: 1em;
  padding: 10px 20px;
  border: 2px solid hsl(200,100%,50%);
  border-radius: 5px;
  box-shadow: 0px 5px 5px hsla(0,0%,0%,.1);
  position: relative;
  top: 0px;
  left: 0px;
  cursor: pointer;
  
  :hover {
    position: relative;
    top: -2px;
    left: 0px
  }

  :active {
    background: ${props => props.primary ? "hsl(200,100%,30%)" : "hsl(0,0%,80%)"};
  }
`;

const PresentationDivFirst = styled.div`
  width: 100vw;
  position: relative;
  max-width: 100%;
  text-align: left;
  background-color: hsl(215, 50%, 95%);
  padding: 100px 0px;
`;

const PresentationDivImage = styled.div`
  width: 100vw;
  max-width: 100%;
  text-align: left;
  padding: 100px 0px;
  background: ${props => `url(${props.image}) no-repeat center center fixed`};
  @media (max-width: 900px) {
    background-attachment: scroll;
  }
  background-size: cover;
`;

const PresentationHeader = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.color};
  padding: 10px 0px;
  text-align: center;
`;

const PresentationText = styled.div`
  width: 95vw;
  max-width: 700px;
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.color};
  padding: 10px 0px;
  text-align: justify;
  margin: 0px auto;
  hyphens: auto;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  max-width: 80vw;
  /* box-shadow: 0 0 50px hsla(0, 0%, 0%, .4); */
  filter: drop-shadow(0 0 10px hsla(0, 0%, 10%, 0.7));
`;

export { ImageHeader, AppWrapper, FadeInDiv, ButtonContainer, Button, PresentationDivFirst, 
          PresentationDivImage, PresentationHeader, PresentationText, Logo };
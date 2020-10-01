import React, { Component } from "react";
import styled from 'styled-components';

const MenuWrapper = styled.div`
  font-size: 1.5em;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10%;
  border: 3px solid black;
  border-radius:20px;
  width: 80%;
  text-align: center;
  background: white;
  padding: 5px;
  display: flex;
  flex-direction: column;
`
const MenuItem = styled.button`
  flex-grow: 1;
  flex-basis:2.5em;
  background: white;
  border: 0px;
  font-size: 0.8em;

`

class Menu extends Component {
  constructor(props) {
    super(props);

    let cities = [...this.props.cities];
    let firstName = cities.splice(this.props.city,1);
    firstName = firstName[0].name;

    this.state = {
      showMenu: false,
      firstName: firstName,
      cities: cities
    };


    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.updateListOfCities = this.updateListOfCities.bind(this);
  }

  updateListOfCities() {
    let cities = [...this.props.cities];
    let firstName = cities.splice(this.props.city,1);
    firstName = firstName[0].name;
    this.setState({firstName:firstName, cities:cities});
  }

  componentDidUpdate(prevProps){
    if ((this.props.cities !== prevProps.cities) || (this.props.city !== prevProps.city) || (this.props.cities.length>this.state.cities.length+1)){
      this.updateListOfCities();
    }
  }


  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener("click", this.closeMenu);
    });

    if (this.props.displayInputs){
      this.props.toggleInputs()
    }
  }

  closeMenu(event) {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener("click", this.closeMenu);
      });
    }
  }

  render() {

    let menuItems = this.state.cities.map((item,i) => {
      return <MenuItem 
              key={item.name} 
              name={i<this.props.city ? i : i+1} 
              onClick={
                (event) => this.props.parseChange(event,'city')
              }>
              {item.name}
              </MenuItem>  
    });

    return (
      <MenuWrapper>
        <div onClick={this.showMenu}>{this.state.firstName}
            <span
            style={{float:'right'}}
          >
            {this.state.showMenu?'▲':'▼'}
          </span>
        </div>

        {this.state.showMenu ? (
          <div
            style={{display:'flex',flexDirection:'column'}}
            ref={element => {
              this.dropdownMenu = element;
            }}
          >
            {menuItems}
          </div>
        ) : null}
      </MenuWrapper>
    );
  }
}

export default Menu;
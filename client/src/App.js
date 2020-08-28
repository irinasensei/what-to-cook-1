import React from "react";
import Search from "./components/search";
import { NavLink } from "react-router-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Routes from "./components/Routes";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: 0,
    };
  }

  //logout button pressed
  userLoggedOut = () => {
    console.log("user logging out");
    localStorage.removeItem("token");
    this.setState({
      userLoggedIn: 0,
    });
    //call the check user logged in function to set state to 0
  };

  isUserLoggedIn = async () => {
    //check if user logged in
    //set flag user logged in
    console.log("checking if user is logged in");
    let token = localStorage.getItem("token");
    // console.log("token", token);
    if (token) {
      try {
        await fetch("api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        //user is already logged in - changing flag in state
        console.log(
          "user logged in, this should change userLoggedIn state to 1"
        );
        this.setState({
          userLoggedIn: 1,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("User not logged in");
      this.setState({
        userLoggedIn: 0,
      });
    }
  };

  componentDidMount = () => {
    //call check if user logged in
    this.isUserLoggedIn();
  };

  render() {
    const { userLoggedIn } = this.state;
    return (
      <div className="App">
        <div className="container-fluid">
          <BrowserRouter>
            <div>
              <header className="row ">
                <NavLink to="/" exact className="navbar-brand">
                  <h1 className="col text-left"> WHAT TO COOK</h1>
                </NavLink>
                <div className="col text-center mt-4">
                  <Search />
                </div>
                <div className="col text-right mt-4">
                  <Navbar
                    userLoggedIn={userLoggedIn}
                    userLoggedOut={this.userLoggedOut}
                    isuserLoggedIn={this.isUserLoggedIn}
                  />
                </div>
              </header>
            </div>
            <main className="row" id="mainbg">
              <Routes />
              <Switch />
            </main>
            <footer className="row">
              this the footer which doesnt exist in design but we probably
              should write somethings like:<br></br>
              <strong>
                Made with &hearts; by Iva Bozic, Julieta Martin, Irina Eliseeva
                as a collaboration project for Codeop bootcamp, FS-09{" "}
              </strong>
            </footer>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
export default App;

import React from "react";

import Search from "./components/search";
import { BrowserRouter, Switch } from "react-router-dom";

import Navbar from "./components/NavBar";
import Routes from "./components/Routes";

import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />

          <Search />
          <Routes />
          <Switch />
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
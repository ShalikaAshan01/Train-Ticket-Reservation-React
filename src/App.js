import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
// Materialize css
import 'materialize-css/dist/css/materialize.min.css';
// components
import signin from "./components/users/signin";
import signup from "./components/users/signup";
import adminHome from "./components/admins/index";



class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/signin" component={signin}/>
        <Route exact path="/signup" component={signup}/>
        <Route exact path="/admin/index" component={adminHome}/>
      </Router>
    );
  }
}

export default App;

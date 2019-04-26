import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
// Materialize css
import 'materialize-css/dist/css/materialize.min.css';
// components
import signin from "./components/users/signin";
import signup from "./components/users/signup";
import addTrain from "./components/admins/addTrain";
import addLine from "./components/admins/addLine";
import editLine from "./components/admins/editLine";
import showRoutes from "./components/showRoute";
import Navbar from "./components/Navbar";
import home from "./components/home";


class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/signin" component={signin}/>
                    <Route exact path="/signup" component={signup}/>
                    <Navbar/>
                    <Route exact path="/" component={home}/>
                    <Route exact path="/admin/train/add" component={addTrain}/>
                    <Route exact path="/admin/line/add" component={addLine}/>
                    <Route exact path="/admin/line/edit" component={editLine}/>
                    <Route exact path="/line" component={showRoutes}/>
                </Router>
            </div>
        );
    }
}

export default App;

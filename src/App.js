import React, {Component} from 'react';
import {BrowserRouter as Router, Route,Redirect,Switch} from "react-router-dom";
import './App.css';
// Materialize css
import 'materialize-css/dist/css/materialize.min.css';
// components
import signin from "./components/users/signin";
import signup from "./components/users/signup";
import signout from "./components/users/signout";
import addTrain from "./components/admins/addTrain";
import addLine from "./components/admins/addLine";
import editLine from "./components/admins/editLine";
import showRoutes from "./components/showRoute";
import Navbar from "./components/Navbar";
import home from "./components/home";
import reservation from "./components/reservation/reservation";

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => (


            localStorage.getItem('user')

                ? <Component {...props} />
                : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
        )} />
    );
}
function Auth({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => (


            localStorage.getItem('user')

                ? <Redirect to={{ pathname: '/signout', state: { from: props.location } }} />
                : <Component {...props} />
        )} />
    );
}

class App extends Component {


    render() {

        const loginContainer = () => (
            <div className="container">
                <Route exact path="/" render={() => <Redirect to="/signin" />} />
                <Auth exact path="/signin" component={signin}/>
            </div>
        );

        const signupContainer = () => (
            <div className="container">
                <Route exact path="/" render={() => <Redirect to="/signup" />} />
                <Auth exact path="/signup" component={signup}/>
            </div>
        );

        const DefaultContainer = () => (
            <div>
                <Navbar />
                <div className="container">
                    <Route exact path="/" component={home}/>
                    <Route exact path="/admin/train/add" component={addTrain}/>
                    <Route exact path="/admin/line/add" component={addLine}/>
                    <Route exact path="/admin/line/edit" component={editLine}/>
                    <Route exact path="/line" component={showRoutes}/>
                    <PrivateRoute exact path="/reservation" component={reservation}/>
                    <PrivateRoute exact path="/signout" component={signout}/>
                </div>
            </div>
        );

        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/(signin)" component={loginContainer}/>
                        <Route exact path="/(signup)" component={signupContainer}/>
                        <Route component={DefaultContainer}/>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;

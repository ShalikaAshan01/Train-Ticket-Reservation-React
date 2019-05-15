import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import M from 'materialize-css'
import logo from '../logo.png';


class Navbar extends Component {

    componentDidMount() {
        var nav = document.querySelectorAll('.sidenav');
        M.Sidenav.init(nav, {});

        var dropdown = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdown,{
            hover: true,
            coverTrigger:false,
            constrainWidth:false
        });
    }
    signout(){
        localStorage.clear();
        this.props.history.push('/');
        window.location.reload();
    }

    render() {

        let lastName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).lastName:'';

        const myAccount = (
            <ul id="dropdown1" className="dropdown-content">
                <li><Link to={"#"}>
                    <i className="material-icons">
                        person
                    </i>
                    Hi, { lastName} </Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/reservation">
                    <i className="material-icons">
                        view_list
                    </i>
                    My Reservations</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/profile/">
                    <i className="material-icons">
                        settings
                    </i>
                    My Profile</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/profile/password/">
                    <i className="material-icons">
                        lock
                    </i>
                    My Password</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="#" onClick={this.signout}>
                    <i className="material-icons">
                        power_settings_new
                    </i>
                    Sign out</Link></li>
            </ul>
        );
        const myAccount2 = (
            <ul id="dropdown2" className="dropdown-content">
                <li><Link to={"#"}>
                    <i className="material-icons">
                        person
                    </i>
                    Hi, { lastName} </Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/reservation">
                    <i className="material-icons">
                        view_list
                    </i>
                    My Reservations</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/profile/">
                    <i className="material-icons">
                        settings
                    </i>
                    My Profile</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="/user/profile/password/">
                    <i className="material-icons">
                        lock
                    </i>
                    My Password</Link></li>
                <li className="divider" tabIndex="-1"></li>
                <li><Link to="#" onClick={this.signout}>
                    <i className="material-icons">
                        power_settings_new
                    </i>
                    Sign out</Link></li>
            </ul>
        );

        return (
            <div>
                {localStorage.getItem('user')? myAccount : ''}
                {localStorage.getItem('user')? myAccount2 : ''}

                <nav>
                    <div className="nav-wrapper blue-grey darken-4">
                        <Link to={"/"} className="brand-logo">
                            <img className="img-responsive" width="90" src={logo} alt="logo"/>


                        </Link>
                        <Link to={""} data-target="mobile-demo" className="sidenav-trigger"><i
                            className="material-icons">menu</i></Link>

                        <ul className="right hide-on-med-and-down">
                            <li>
                                <Link to="/"><i className="material-icons left">home</i>
                                    Home
                                </Link>
                            </li>

                            <li>
                                {localStorage.getItem('user')?'':
                                    <Link to="/signup"><i className="material-icons left">person_add</i>
                                        Sign Up
                                    </Link>
                                }
                            </li>
                            <li>
                                {localStorage.getItem('user')?'':
                                    <Link to="/signin"><i className="material-icons left">fingerprint</i>Sign In</Link>
                                }
                            </li>
                            <li>

                                {localStorage.getItem('user')?
                                    <Link to="#" className="dropdown-trigger" data-target="dropdown1">
                                        <i className="material-icons left">account_circle</i>
                                        My Account
                                    </Link>
                                    :''}
                            </li>
                        </ul>


                        <ul className="sidenav" id="mobile-demo">
                            <li>
                                <Link to="/"><i className="material-icons left">home</i>
                                    Home
                                </Link>
                            </li>

                            <li>
                                {localStorage.getItem('user')?'':
                                    <Link to="/signup"><i className="material-icons left">person_add</i>
                                        Sign Up
                                    </Link>
                                }
                            </li>
                            <li>
                                {localStorage.getItem('user')?'':
                                    <Link to="/signin"><i className="material-icons left">fingerprint</i>Sign In</Link>
                                }
                            </li>
                            <li>

                                {localStorage.getItem('user')?
                                    <Link to="#" className="dropdown-trigger col s6" data-target="dropdown2">
                                        <i className="material-icons left">account_circle</i>
                                        My Account
                                    </Link> :''}
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

export default withRouter(Navbar)

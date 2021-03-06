import React, {Component} from 'react'
import M from 'materialize-css';
import logo from '../../logo.png';
import {signinFunction} from '../functions/userFunctions';
import { Link } from 'react-router-dom'


class login extends Component {
    componentDidMount() {
        document.title="Signin";
        // Auto initialize all the things!
        M.AutoInit();
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            message:null
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value,message:null})
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password
        };

        signinFunction(user).then(res => {
            if (res) {
                res = res.data;
                if (res.success){
                    this.setState({message:null});
                    localStorage.setItem('user', JSON.stringify(res.user));
                    let to = this.props.location.state!==undefined ? this.props.location.state.from : '/';
                    this.props.history.push(to);

                }else
                {
                    this.setState({message:res.message});
                }
            }
        })
    }

    render() {
        return (
            <div>


                <div className="row valign-wrapper">
                    <div className="col s2"> </div>
                    <div className="col s8 valign m8">
                        <div className="card z-depth-1 grey lighten-4">
                            <div className="card-content">

                                {/* Card header */}
                                <div className="center-align">
                                    <img className="img-responsive" width="100" src={logo} alt="logo"/>
                                    <h5 className="indigo-text">Please, login into your account</h5>
                                </div>

                                <div className={this.state.message!=null ? 'center-align msg msg-warning z-depth-3 scale-transition' : ''} >
                                    {this.state.message} </div>

                                <div className="row">
                                    <form className="col s12" onSubmit={this.onSubmit}>

                                        {/* input fields */}
                                        <div className="row">
                                            <div className="col s01"></div>
                                            <div className="input-field col s10">
                                                <i className="material-icons prefix">email</i>
                                                <input id="email" type="email" className="validate" name="email"
                                                       value={this.state.email} onChange={this.onChange} required
                                                />
                                                <label htmlFor="email">Enter Your Email Address</label>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col s01"></div>
                                            <div className="input-field col s10">
                                                <i className="material-icons prefix">lock</i>
                                                <input id="password" type="password" className="validate"
                                                       name="password"
                                                       value={this.state.password} onChange={this.onChange} required
                                                />
                                                <label htmlFor="password">Enter Your Password</label>
                                            </div>
                                        </div>

                                        {/* buttons */}
                                        <div className='row'>
                                            <button type='submit' name='btn_login'
                                                    className='col s12 btn btn-large waves-effect indigo'>Signin
                                            </button>
                                        </div>

                                        <div className='row'>
                                            <Link to="/signup" className="waves-effect waves-light btn btn-large col s12">Signup</Link>
                                        </div>

                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col s2"> </div>
                </div>
            </div>
        )
    }
}

export default login;

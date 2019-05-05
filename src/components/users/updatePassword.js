import React, { Component } from 'react'
import M from 'materialize-css';
import {fn_updatePassword, validateUser} from '../functions/userFunctions';
import { Link } from 'react-router-dom'
import swal from '@sweetalert/with-react'
import logo from "../../logo.png";

var user;
var context;
class updatePassword extends Component{
    componentDidMount() {
        document.title = "Change Password";

        context = this;
        // Auto initialize all the things!
        M.AutoInit();
        user = JSON.parse(localStorage.getItem('user'));

        //validate user
        let data = {
            _id: user._id,
            _token: user._token
        };



        if(user._id === this.props.match.params.id){
            validateUser(data).then(res => {
                res = res.data;
                if(!res.success){
                    localStorage.clear();
                    sessionStorage.clear();
                    swal("Authentication Error", "Cannot authenticate user,Please Login", "warning").then(val => {
                        if (val) {
                            this.props.history.push({
                                    pathname: '/signin',
                                    state: {
                                        from: context.props.location
                                    }
                                }
                            );
                        }
                    })

                }
            }).catch(() => {
                localStorage.clear();
                sessionStorage.clear();
                swal("Authentication Error", "Cannot Authenticate user,Please Login", "warning").then(val => {
                    if (val) {
                        this.props.history.push({
                                pathname: '/signin',
                                state: {
                                    from: this.props.location
                                }
                            }
                        );
                    }
                })

            });
        }else{
            this.props.history.push('/user/profile/'+user._id+"/password");
            window.location.reload();
        }
    }


    constructor(props) {
        super(props);
        this.state = {
            password: '',
            oldpassword:'',
            valid:false,
            validPassword:true,
            validCPassword:true,
            message:null,
            user:{}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //validation
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlecPasswordChange = this.handlecPasswordChange.bind(this);

    }

    //password validation

    validatePassword (text) {
        const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/
        return re.test(text)
    }

    //password validate
    handlePasswordChange(e) {
        const text = e.target.value;
        const isValid = this.validatePassword(text);

        this.setState({
            password: e.target.value,
            valid:isValid,
            validPassword:isValid
        })
    }
    //check password validate
    handlecPasswordChange(e) {
        const text = e.target.value;


        const isValid = text===this.state.password;

        this.setState({
            valid:isValid,
            validCPassword:isValid,
        })
    }


    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault();

        //if all fields are valid then call the api
        if(this.state.valid && this.state.validCPassword && this.state.validPassword){

            const header = {
                headers: {
                    _id:user._id,
                    _token:user._token
                }
            };

            let values = {
                password:this.state.password,
                oldpassword:this.state.oldpassword,
                _id:user._id,
            };

            fn_updatePassword(values,header)
                .then(data=>{
                    data = data.data;
                    if(data.success){
                        swal("Excellent",data.message+". You will be logged out from system","success")
                        localStorage.removeItem('user');
                        context.props.history.push('/')
                    }else{
                        this.setState({message:data.message});

                        alert(this.state.message);
                        setTimeout(() => {
                            this.setState({
                                message: null
                            });
                        }, 120000);
                    }
                }).catch(error=>{
                Object.assign({}, error);
                this.setState({
                    message:error.response.data.message
                });
                setTimeout(() => {
                    this.setState({
                        message: null
                    });
                }, 120000);
            })
        }

    }


    render() {
        return(
            <div className="container">

                <div className="row valign-wrapper">
                    <div className="col s2"> </div>
                    <div className="col s8 valign m8">
                        <div className="card z-depth-1 grey lighten-4">
                            <div className="card-content">

                                {/* Card header */}
                                <div className="center-align">
                                    <img className="img-responsive" src={logo} alt="logo"/>
                                    <h5 className="indigo-text">Change Password</h5>
                                </div>

                                <div className={this.state.message!=null ? 'center-align msg msg-error z-depth-3 scale-transition' : ''} >
                                    {this.state.message} </div>

                                <div className="row">
                                    <form className="col s12" onSubmit={this.onSubmit}>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">lock</i>
                                                <input id="old_password" type="password" className={"valid"} name="oldpassword"
                                                       value={this.state.oldpassword}
                                                       onChange={this.onChange}
                                                       required
                                                />
                                                <label htmlFor="old_password">Old Password</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">lock</i>
                                                <input id="password" type="password" className={this.state.validPassword ? 'valid' : 'invalid'} name="password"
                                                       value={this.state.password}
                                                       onChange={this.handlePasswordChange}
                                                       required
                                                />
                                                <label htmlFor="password">Password</label>
                                                <span className="red-text">{this.state.validPassword ? '' : 'Your password must containt one uppercase, one lowercase, one character, one number and at least Eight characters'}</span>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">lock</i>
                                                <input id="cpassword" type="password" className={this.state.validCPassword ? 'valid' : 'invalid'} name="cpassword"
                                                       value={this.state.cpassword}
                                                       onChange={this.handlecPasswordChange}
                                                       required
                                                />
                                                <label htmlFor="cpassword">Re-type Password</label>
                                                <span className="red-text">{this.state.validCPassword ? '' : "Combination of Password and Confirm Password doesn't match"}</span>
                                            </div>
                                        </div>

                                        {/* buttons */}
                                        <div className='row'>
                                            <button type='submit' name='signup' className='col s12 btn waves-effect indigo'>Change Password</button>
                                        </div>

                                        <div className="row">
                                            <Link to={"/"} className="col s12 waves-effect waves-light btn red accent-2">
                                                <i className="material-icons left">reply_all</i>
                                                Cancel
                                            </Link>
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
export default updatePassword
;


import React, { Component } from 'react'
import M from 'materialize-css';
import {fn_updateProfile, validateUser} from '../functions/userFunctions';
import { Link } from 'react-router-dom'
import swal from '@sweetalert/with-react'

var user;
var context;
class updateProfile extends Component{
    componentDidMount() {
        document.title = "Change Profile";

        context = this;
        // Auto initialize all the things!
        M.AutoInit();
        user = JSON.parse(localStorage.getItem('user'));
        this.setState({
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            telephoneNumber : user.telephoneNumber,
        });

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
            this.props.history.push('/user/profile/'+user._id);
            window.location.reload();

        }

    }


    constructor(props) {
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
            telephoneNumber:'',
            email: '',
            password: '',
            valid:true,
            validFname:true,
            validLname:true,
            validTelephone:true,
            validEmail:true,
            message:null,
            user:{}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //validation
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleNoChange = this.handleNoChange.bind(this);

    }
    //email validation
    validateEmail (email) {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        return re.test(email)
    }

    handleEmailChange(e) {
        const email = e.target.value;
        const emailValid = this.validateEmail(email);

        this.setState({
            email: e.target.value,
            valid:emailValid,
            validEmail:emailValid
        })
    }
    //text validation
    validateText (name) {
        const re = /^[a-zA-Z ]*$$/
        return re.test(name)
    }

    //firstname validate
    handleFirstNameChange(e) {
        const name = e.target.value;
        const nameValid = this.validateText(name);

        this.setState({
            firstName: e.target.value,
            valid:nameValid,
            validFname:nameValid
        })
    }

    //firstname validate
    handleLastNameChange(e) {
        const name = e.target.value;
        const nameValid = this.validateText(name);

        this.setState({
            lastName: e.target.value,
            valid:nameValid,
            validLname:nameValid
        })
    }

    //number validation
    validateNumber (name) {
        const re = /(075|077|076|071|070|072:078)\d{7}/
        return re.test(name)
    }

    //telephone number validate
    handleNoChange(e) {
        const num = e.target.value;
        const isValid = this.validateNumber(num);

        this.setState({
            telephoneNumber: e.target.value,
            valid:isValid,
            validTelephone:isValid
        })
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit (e) {
        e.preventDefault();

        const values = {
            _id:user._id,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
            telephoneNumber:this.state.telephoneNumber,
            email: this.state.email,
            password: this.state.password
        };
        const header = {
            headers: {
                _id:user._id,
                _token:user._token
            }
        };

        //if all fields are valid then call the api
        if(this.state.valid && this.state.validEmail && this.state.validFname && this.state.validTelephone && this.state.validLname
        ){
            fn_updateProfile(values,header).then(res => {
                res = res.data;
                if(res.success){
                    localStorage.removeItem('user');
                    localStorage.setItem('user',JSON.stringify(res.user));
                    swal("Great Job",res.message,"success")
                }else{
                    this.setState({message:res.message});

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
        }else{
            console.log("error")
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
                                    <h5 className="indigo-text">Update Account</h5>
                                </div>

                                <div className={this.state.message!=null ? 'center-align msg msg-error z-depth-3 scale-transition' : ''} >
                                    {this.state.message} </div>

                                <div className="row">
                                    <form className="col s12" onSubmit={this.onSubmit}>

                                        {/* input fields */}
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <i className="material-icons prefix">perm_identity</i>
                                                <input id="firstName" type="text" className={this.state.validFname ? 'valid' : 'invalid'} name="firstName"
                                                       value={this.state.firstName}
                                                       onChange={this.handleFirstNameChange}
                                                       required
                                                />
                                                <label htmlFor="firstName">First Name</label>
                                                <span className="red-text">{this.state.validFname ? '' : 'Please Enter Valid Firstname'}</span>
                                            </div>

                                            <div className="input-field col s6">
                                                <i className="material-icons prefix">perm_identity</i>
                                                <input id="lastName" type="text" className={this.state.validLname ? 'valid' : 'invalid'} name="lastName"
                                                       value={this.state.lastName}
                                                       onChange={this.handleLastNameChange}
                                                       required
                                                />
                                                <label htmlFor="lastName">Last Name</label>
                                                <span className="red-text">{this.state.validLname ? '' : 'Please Enter Valid Lastname'}</span>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">email</i>
                                                <input id="email" type="email" className={this.state.validEmail ? 'valid' : 'invalid'} name="email"
                                                       value={this.state.email}
                                                       onChange={this.handleEmailChange}
                                                       required
                                                />
                                                <label htmlFor="email">Email Address</label>
                                                <span className="red-text">{this.state.validEmail ? '' : 'Please Enter Valid Email Address'}</span>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="input-field col s12">
                                                <i className="material-icons prefix">phone</i>
                                                <input id="telephoneNumber" type="text" className={this.state.validTelephone ? 'valid' : 'invalid'} name="telephoneNumber"
                                                       value={this.state.telephoneNumber}
                                                       onChange={this.handleNoChange}
                                                       required
                                                />
                                                <label htmlFor="telephoneNumber">Telephone Number</label>
                                                <span className="red-text">{this.state.validTelephone ? '' : 'Please Enter Valid Mobile Number'}</span>
                                            </div>
                                        </div>

                                        {/* buttons */}
                                        <div className='row'>
                                            <button type='submit' name='signup' className='col s12 btn waves-effect indigo'>Update</button>
                                        </div>

                                        <div className="row">
                                        <Link to={"/"} className="col s12 waves-effect waves-light btn red accent-2">
                                                <i className="material-icons left">reply_all</i>
                                                Go Back
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
export default updateProfile;

import React, { Component } from 'react'
import M from 'materialize-css';
import logo from '../../logo.png';
import {signupFunction} from '../functions/userFunctions';
import { Link } from 'react-router-dom'


class login extends Component{
    componentDidMount() {
        // Auto initialize all the things!
        M.AutoInit();
    }
    

    constructor() {
      super();
      this.state = {
        firstName:'',
        lastName:'',
        telephoneNumber:'',
        email: '',
        password: '',
        valid:false,
        validFname:true,
        validLname:true,
        validTelephone:true,
        validEmail:true,
        validPassword:true,
        validCPassword:true,
        message:null
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //validation
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.handleNoChange = this.handleNoChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handlecPasswordChange = this.handlecPasswordChange.bind(this)

    }
    //email validation
    validateEmail (email) {
      const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      return re.test(email)
    }

    handleEmailChange(e) {
      const email = e.target.value
      const emailValid = this.validateEmail(email) 

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

      const user = {
          firstName:this.state.firstName,
          lastName:this.state.lastName,
          telephoneNumber:this.state.telephoneNumber,
          email: this.state.email,
          password: this.state.password
      };

      //if all fields are valid then call the api
      if(this.state.valid && this.state.validCPassword && this.state.validEmail && this.state.validPassword
          && this.state.validFname && this.state.validTelephone && this.state.validLname 
        ){
        signupFunction(user).then(res => {
          res = res.data;
          if(res.success){
            alert(res.message);
              this.props.history.push(`/signin`);
          }else{
            this.setState({message:res.message});

            alert(this.state.message);
            setTimeout(() => {
              this.setState({
                message: null
              });
            }, 120000);
          }
        }).catch(err=>{
          console.log(err);
        })
      }
  }


    render() {
        return(
          <div className="container">

            <div className="row valign-wrapper">
              <div className="col s6 offset-s3 valign m6 offset-m3">
                <div className="card z-depth-1 grey lighten-4">
                  <div className="card-content">

              {/* Card header */}
              <div className="center-align">
              <img className="img-responsive" src={logo} alt="logo"/>
                <h5 className="indigo-text">Create an Account</h5>
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
                      <button type='submit' name='signup' className='col s12 btn btn-large waves-effect indigo'>Signup</button>
                    </div>

                    <div className='row'>
                    <Link to="/signin" className="waves-effect waves-light btn btn-large col s12">Signin</Link>
                    </div>

                    </form>
                  </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}
export default login;

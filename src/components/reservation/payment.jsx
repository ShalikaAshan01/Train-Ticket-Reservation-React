import React, {Component} from 'react'
import logo from "../../logo.png";
import swal from '@sweetalert/with-react'
import M from 'materialize-css'
// import {Link} from 'react-router-dom'
// import {validateUser} from "../functions/userFunctions";
import valid from 'card-validator';
import {validateUser} from "../functions/userFunctions";
import {fn_makeReservation} from "../functions/scheduleFunctions";
import {fn_sendMail} from "../functions/mailer";
var context;
class payment extends Component{

    constructor(props){
        super(props);
        context = this;
        this.state = {
            cardnumber:"4111111111111111",
            cardtype:null,
            cvv:"147",
            month:"12",
            year:"20",
            name:"da",
            email:"",
            send:"send",
            phone:"",
            reservation : {
                total:"",
                seats:"",
                class:"",
                discount:"",
                date:"",
                departure:"",
                arrival:"",
                trainID:"",
                userID:"",
                trainName:"",
                from:"",
                to:""

            }
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({[e.target.name]: e.target.value,message:null});


        if(e.target.name === "cardnumber"){

            var numberValidation = valid.number(e.target.value);

            this.setState({
                cardtype:numberValidation.card? numberValidation.card.type : null
            })
        }
    }

    componentDidMount() {

        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems,
            {
            }
        );

        //validating user
        let user = JSON.parse(localStorage.getItem('user'));
        let data = {
            _id: user._id,
            _token: user._token
        };
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

        //validate page data
        if(this.props.location.state !== undefined){
            let state = this.props.location.state;

            if(state.seats !== undefined && state.class !== undefined && state.discount !== undefined && state.total !== undefined &&
                state.departure !== undefined && state.arrival !== undefined && state.date !== undefined && state.trainID !== undefined
            ){
                state.userID = JSON.parse(localStorage.getItem('user'))._id;
                state.type = "card";
                this.setState({
                    reservation:state,
                    email:JSON.parse(localStorage.getItem('user')).email
                })
            }else
                this.props.history.push('/error/400');

        }else{
            this.props.history.push('/error/400');
        }

    }

    onSubmit(e){
        e.preventDefault();

        let cvv = this.state.cvv;
        let number = this.state.cardnumber;
        let month = this.state.month;
        let year = this.state.year;
        let name = this.state.name;

        if(valid.number(number).isValid && valid.expirationDate(month+year).isValid && valid.cvv(cvv).isValid){

            let card={
                cardnumber:number,
                month:month,
                year:year,
                cardholder:name,
                cvv:cvv,
            };

            let values = {
                reservation:this.state.reservation,
                card:card
            };

            let user = JSON.parse(localStorage.getItem('user'));

            const header = {
                headers: {
                    _id:user._id,
                    _token:user._token
                }
            };
            const instance = M.Modal.getInstance(document.querySelector('#modal1'));
            fn_makeReservation(values.reservation,header).then(data=>{
                if(data.data.success){
                    instance.open();
                }
            }).catch(err=>{
                swal("Success",err.message,"success")

            })


        }else{
            swal("Invalid Card Information!", "Please re-enter credit card information!", "error");
            this.setState({
                cardnumber:"",
                cvv:"",
                month:"",
                year:"",
                name:""
            })
        }


    }

    sendEbill(){

        context.setState({
            send:"Sending..."
        });

        const formatArea = "<h5>Receipt of Payment</h5>" +
            "<br/>" +
            "<b>Train: "+context.state.reservation.trainName+" ("+context.state.reservation.from +" to "+ context.state.reservation.to+")</b><br/>" +
            "<b>User: "+JSON.parse(localStorage.getItem('user')).firstName + " " + JSON.parse(localStorage.getItem('user')).lastName+"</b><br/>" +
            "<b>Journey: "+context.state.reservation.from+" to "+ context.state.reservation.to+"</b><br/>" +
            "<b>Tickets: "+context.state.reservation.seats+", Class: "+context.state.reservation.class+" </b><br/>" +
            "<b>Date: "+context.state.reservation.date+"</b><br/>" ;


        let val = {
            to:context.state.email,
            subject:"Receipt for your Payment",
            text:"TRS",
            html:formatArea
        };

        fn_sendMail(val).then(()=>{
            const instance = M.Modal.getInstance(document.querySelector('#modal1'));
            instance.close();

            swal("Email was Send","We will redirect you to homepage",'success').then(()=>{
                context.props.history.push('/')
            })
        });
    }

    render() {

        const receipt = (
            <div>
                <h5>Receipt of Payment</h5>

                <b>Train: {this.state.reservation.trainName} ({this.state.reservation.from} to {this.state.reservation.to})</b><br/>
                <b>User: {JSON.parse(localStorage.getItem('user')).firstName + " " + JSON.parse(localStorage.getItem('user')).lastName}</b><br/>
                <b>Journey: {this.state.reservation.from} to  {this.state.reservation.to}</b><br/>
                <b>Tickets: {this.state.reservation.seats}, Class: {this.state.reservation.class} </b><br/>
                <b>Date: {this.state.reservation.date}</b><br/>
            </div>
        );

        const cardimg = (
            <img className="img-responsive mt-4" width={45} src={process.env.PUBLIC_URL + '/icon/'+this.state.cardtype+'.png'} alt="logo"/>
        );

        return(
         <div>

             <div className="card p-10">
                 <div className="row">
                     <div className="col s4"><img className="img-responsive" width={90} src={logo} alt="logo"/></div>
                     <div className="col s4"><h5 className="font-bold">Payment Details</h5></div>
                     <div className="col s4"><img className="img-responsive mt-4" src={process.env.PUBLIC_URL + '/icon/accepted.png'} alt="logo"/></div>
                     <div className="col s4 right-align"><img className="img-responsive mt-4" width={50} src={process.env.PUBLIC_URL + '/icon/sampath.jpg'} alt="logo"/></div>
                 </div>
             </div>

             {/*<div id="card-success" className="">*/}
             {/*    <i className=""></i>*/}
             {/*    <p>Payment Successful!</p>*/}
             {/*</div>*/}
             {/*<div id="form-errors" className="hidden">*/}
             {/*    <i className=""></i>*/}
             {/*    <p id="card-error">Card error</p>*/}
             {/*</div>*/}

             <form onSubmit={this.onSubmit}>
                 <div id="form-container">

                     <div id="card-front">
                         <div id="shadow"> </div>
                         <div id="image-container">
                             <span id="amount">paying: <strong>LKR {this.state.reservation.total}</strong></span>
                             <span id="card-image">

                                 {this.state.cardtype !== null? cardimg : ''}



                             </span>
                         </div>

                         <label className="label" htmlFor="card-number">
                             Card Number
                         </label>
                         <input type="text" id="card-number" className="browser-default" name="cardnumber" placeholder="1234 5678 9101 1112" maxLength={16} minLength={16}
                                value={this.state.cardnumber} onChange={this.onChange} required
                         />
                         <div id="cardholder-container">
                             <label className="label"htmlFor="card-holder">Card Holder
                             </label>
                             <input type="text" id="card-holder" name="name" placeholder="e.g. John Doe" className="browser-default" required
                             value={this.state.name} onChange={this.onChange}
                             />
                         </div>
                         <div id="exp-container">
                             <label htmlFor="card-exp" className="label">
                                 Expiration
                             </label>
                             <input id="card-month" type="text" name="month" placeholder="MM" maxLength="2" minLength={2} className="browser-default" required
                             value={this.state.month} onChange={this.onChange}
                             />
                             <input id="card-year" type="text" name="year" placeholder="YY" maxLength={2} minLength={2} className="browser-default" required
                             value={this.state.year} onChange={this.onChange}
                             />
                         </div>
                         <div id="cvc-container">
                             <label htmlFor="card-cvc" className="label"> CVC/CVV</label>
                             <input id="card-cvc" placeholder="XXX-X" name="cvv" type="text" maxLength={4} minLength={3} className="browser-default"
                                    value={this.state.cvv} onChange={this.onChange}
                                    required/>
                             <p>Last 3 or 4 digits</p>
                         </div>
                     </div>
                     <div id="card-back">
                         <div id="card-stripe">
                         </div>

                     </div>
                     <input type="text" id="card-token" />
                     {/*<button type="button" id="card-btn" >Submit</button>*/}
                     <button type="submit" id="card-btn" className="ml-5 waves-effect waves-light btn green accent-4">
                         <i className="material-icons left">credit_card</i>
                         Pay
                     </button>
                 </div>
             </form>


             <div id="modal1" className="modal">
                 <div className="modal-content">
                     <h4>Successfully Paid</h4>

                     {receipt}
                     {/*form*/}

                     <div className="row">
                         <div className="input-field col s6">
                             <i className="material-icons prefix">email</i>
                             <input id="email" type="email" name="email" className="validate" onChange={this.onChange} value={this.state.email}/>
                                 <label htmlFor="email">Email Address</label>
                         </div>
                         <div className="input-field col s6">
                             <i className="material-icons prefix">phone</i>
                             <input id="icon_telephone" name="phone" type="tel" className="validate" value={this.state.phone} onChange={this.onChange}/>
                                 <label htmlFor="icon_telephone">Telephone</label>
                         </div>
                     </div>

                 </div>
                 <div className="modal-footer">
                     <button className="btn waves-effect waves-light" type="submit" name="action" onClick={this.sendEbill}>Send
                         <i className="material-icons right">{this.state.send}</i>
                     </button>
                 </div>


             </div>

         </div>
        )
    }
}
export default payment

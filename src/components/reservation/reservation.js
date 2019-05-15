import React, {Component} from 'react'
import M from 'materialize-css';
import swal from '@sweetalert/with-react'
import {Link} from 'react-router-dom'
import {validateUser} from "../functions/userFunctions";
import {fn_getSpecificSchedule, fn_makeReservation} from "../functions/scheduleFunctions";
import {fn_getSpecificPricingInfo} from "../functions/pricingFunctions";
import moment from 'moment';
import {fn_sendMail} from "../functions/mailer";

var context;

class reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                class: "unknown",
            },
            phone:"",
            email:'',
            discount: 0,
            seats: "",
            price: {
                A: "0",
                B: "0",
                C: "0"
            },
            telephone:"",
            pin:"",
            subtotal: 0,
            discountamount: 0,
            grandtotal: 0,
            info: {
                departure: "",
                arrival: "",
                trainID: "",
                date: "",
                trainName: "",
                type: "",
                A: "",
                B: "",
                C: "",
                from: "",
                to: ""
            }
        };
        this.onChange = this.onChange.bind(this)
        this.onChangeForDialog = this.onChangeForDialog.bind(this)
    }

    componentDidMount() {


        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});

        // const context = this;
        context = this;
        document.title = "Reserve Tickets";

        //validating user
        let user = JSON.parse(localStorage.getItem('user'));
        let data = {
            _id: user._id,
            _token: user._token
        };
        validateUser(data).then(res => {
            res = res.data;
            if (!res.success) {
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

        //validate if page is valid or not
        if (this.props.location.state === undefined) {
            this.props.history.push('/error/400');
        } else {
            let loc = this.props.location.state;

            if (loc.departure !== undefined && loc.arrival !== undefined && loc.date !== undefined
                && loc.trainID !== undefined && loc.type !== undefined) {


                fn_getSpecificSchedule({
                    _tid: loc.trainID,
                    date: moment(new Date(loc.date)).format('MM-DD-YYYY')
                }).then(data => {
                    data = data.data.schedule;
                    this.setState({
                        info: {
                            departure: loc.departure,
                            arrival: loc.arrival,
                            trainID: loc.trainID,
                            date: loc.date,
                            trainName: data.trainName,
                            A: data.availableSeats.A,
                            B: data.availableSeats.B,
                            C: data.availableSeats.C,
                            type: loc.type,
                            from: data.route.from.station,
                            to: data.route.to.station,
                        }
                    });
                }).catch(() => {
                    this.props.history.push('/error/404');
                });

                let today = moment().format("MM-DD-YYYY");

                var duration = moment.duration(moment(new Date(loc.date)).diff(moment(new Date(today)))).as('days');

                if (duration < 0) {
                    this.props.history.push('/error/410');
                }
            } else {
                this.props.history.push('/error/400');
            }


            //get price information
            fn_getSpecificPricingInfo(this.props.location.state.type).then(data => {
                data = data.data;
                this.setState({
                    email:JSON.parse(localStorage.getItem('user')).email,
                    price: {
                        A: data.price.price.classA,
                        B: data.price.price.classB,
                        C: data.price.price.classC,
                    }
                });
            }).catch(() => {
                this.props.history.push('/error/400');
            })

        }

    }

    handleSelectChange = (event) => {
        this.setState({
            inputs: {
                class: event.target.value
            }
        })
    };

    sendEbill(){

        context.setState({
            send:"Sending..."
        });

        const formatArea = "<h5>Receipt of Payment</h5>" +
            "<br/>" +
            "<b>Train: "+context.state.info.trainName+" ("+context.state.info.from +" to "+ context.state.info.to+")</b><br/>" +
            "<b>User: "+JSON.parse(localStorage.getItem('user')).firstName + " " + JSON.parse(localStorage.getItem('user')).lastName+"</b><br/>" +
            "<b>Journey: "+context.state.info.from+" to "+ context.state.info.to+"</b><br/>" +
            "<b>Tickets: "+context.state.seats+", Class: "+context.state.class+" </b><br/>" +
            "<b>Date: "+context.state.info.date+"</b><br/>" ;


        let val = {
            to:context.state.email,
            subject:"Receipt for your Payment",
            text:"TRS",
            html:formatArea
        };

        fn_sendMail(val).then(()=>{
            const instance = M.Modal.getInstance(document.querySelector('#modal1'));
            instance.close();

            swal("Email was Send","You will redirect you to homepage",'success').then(()=>{
                context.props.history.push('/')
            })
        });
    }

    payDialog(){

        let dialog={
            pin:context.state.pin,
            telephoneNumber:context.state.telephone
        };

        let reservation = {
            seats: context.state.seats,
            class: context.state.inputs.class,
            discount: context.state.discountamount,
            total: context.state.grandtotal,
            departure: context.state.info.departure,
            arrival: context.state.info.arrival,
            from: context.state.info.from,
            to: context.state.info.to,
            type:"dialog",
            trainName: context.state.info.trainName,
            date: moment(new Date(context.state.info.date)).format("MM-DD-YYYY"),
            trainID:context.state.info.trainID
        };


        let values = {
            reservation:reservation,
            dialog:dialog
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
    }

    addPromo() {
        swal({
            text: 'Only government employees can get discounts, Please Enter NIC number',
            content: "input",
            button: {
                text: "Search!",
                closeModal: false,
            },
        })
            .then(nic => {
                return fetch(` http://localhost:3000/pricing/discounts/${nic}`);
            })
            .then(results => {
                return results.json();
            })
            .then(json => {

                if (!json.success) {
                    context.setState({
                        discount: 0,
                    });
                    return swal(json.message);
                }

                let subtotal = context.state.price[context.state.inputs.class] * context.state.seats;

                if (json.discount === undefined) {
                    json.discount = 0;
                }

                let discountamount = (subtotal * json.discount) / 100.0;
                let total = subtotal - discountamount;

                context.setState({
                    discount: json.discount,
                    subtotal: subtotal,
                    discountamount: discountamount,
                    grandtotal: total,
                });


                const discount = "You got " + json.discount + "% discount";

                swal({
                    title: "Congratulations...",
                    text: discount,
                    icon: "success",
                });
            })
            .catch(err => {
                if (err) {
                    swal("Oh noes!", "Internal Error occurs!", "error");
                } else {
                    swal.stopLoading();
                    swal.close();
                }
            });

    }

    onChange(event) {
        const re = /^[0-9\b]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {

            let max = this.state.info[this.state.inputs.class];

            let value = event.target.value;

            this.setState({
                seats: value

            });
            if (max === undefined) {
                value = 0;
            } else if (value > max) {
                value = max;
            }

            let subtotal = this.state.price[this.state.inputs.class] * value;
            let discount = (subtotal * this.state.discount) / 100.0;
            let total = subtotal - discount;

            this.setState({
                seats: value,
                subtotal: subtotal,
                discountamount: discount,
                grandtotal: total,
            });
        }
    }

    onChangeForDialog(e){
        this.setState({[e.target.name]: e.target.value,message:null});
    }

    checkout() {

        let reservation = {
            seats: context.state.seats,
            class: context.state.inputs.class,
            discount: context.state.discountamount,
            total: context.state.grandtotal,
            departure: context.state.info.departure,
            arrival: context.state.info.arrival,
            from: context.state.info.from,
            to: context.state.info.to,
            trainName: context.state.info.trainName,
            date: moment(new Date(context.state.info.date)).format("MM-DD-YYYY"),
            trainID:context.state.info.trainID
        };

        if (reservation.total !== 0){
            context.props.history.push({
                    pathname: '/reservation/payment',
                    state:reservation
                }
            );
        }
    }


    render() {

        const receipt = (
            <div>
                <h5>Receipt of Payment</h5>

                <b>Train: {this.state.info.trainName} ({this.state.info.from} to {this.state.info.to})</b><br/>
                <b>User: {JSON.parse(localStorage.getItem('user')).firstName + " " + JSON.parse(localStorage.getItem('user')).lastName}</b><br/>
                <b>Journey: {this.state.info.from} to  {this.state.info.to}</b><br/>
                <b>Tickets: {this.state.seats}, Class: {this.state.class} </b><br/>
                <b>Date: {this.state.info.date}</b><br/>
            </div>
        );


        //Initialization
        //select
        var elems_select = document.querySelectorAll('select');
        M.FormSelect.init(elems_select, {});

        const summary = (
            <div className="row">
                <div className="col s12 m12">
                    <div className="card blue-grey darken-1 z-depth-5">
                        <div className="card-content white-text">
                            <b className="card-title">Summary</b>

                            <div className="row">
                                <div className="col s4"></div>
                                <div className="col s4">
                                    <span
                                        className="center-align">Class {this.state.inputs.class} ({this.state.price[this.state.inputs.class]}) * {this.state.seats}</span><br/>
                                    <span
                                        className="center-align font-italic">({this.state.info.type} Train)</span>
                                </div>
                                <div className="col s4 right-align">
                                    <span>:{this.state.subtotal}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s4"></div>
                                <div className="col s4">
                                    <b className="center-align">Discount %{this.state.discount} off</b>
                                </div>
                                <div className="col s4 right-align">
                                    <b> {this.state.discountamount}</b>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s4"></div>
                                <div className="col s4">
                                    <h4 className="">Grand Total</h4>
                                </div>
                                <div className="col s4 right-align">
                                    <h4>LKR {this.state.grandtotal}</h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
        const cardAction = (
            <div className="card-action">

                <div className="left-align">
                    <Link to={"/"} className="ml-5 waves-effect waves-light btn red accent-2">
                        <i className="material-icons left">reply_all</i>
                        Go Back
                    </Link>
                </div>
                <div className="right-align row">
                    <button data-target="modal2" className="modal-trigger waves-effect waves-light btn inp-icon-dialog amber accent-4">
                        Credit the monthly bill
                    </button>
                    <button className="ml-5 waves-effect waves-light btn green accent-4" onClick={this.checkout}>
                        <i className="material-icons left">credit_card</i>
                        Checkout
                    </button>
                </div>
            </div>
        );

        return (
            <div>
                <div className="row valign-wrapper offset-m3 summary">
                    <div className="col s12 m12 ">
                        <div className="card grey lighten-5 z-depth-3">
                            <div className="card-content text-blue-grey text-darken-4">

                                <div className="card grey lighten-5 z-depth-3">
                                    <div className="card-content text-blue-grey text-darken-4">
                                        <span className="card-title">Train Information</span>
                                        <div className={"row"}>
                                            <div className={"col s4 center-align"}><h5>Train</h5></div>
                                            <div className={"col s4 center-align"}><h5>Journey</h5></div>
                                            <div className={"col s2  center-align"}><h5>Class</h5></div>
                                            <div className={"col s2 center-align"}><h5>Seats</h5></div>

                                        </div>


                                        <div className={"row mt-5"}>
                                            <div className={" input-field col s4 center-align"}>
                                                <Link to={"dada"}>
                                                    <span>
                                                        {this.state.info.trainName}({this.state.info.from} to {this.state.info.to})
                                                    </span><br/>
                                                    <span>{moment(new Date(this.state.info.date)).format('MMMM DD, YYYY')}</span>
                                                </Link>
                                            </div>

                                            <div className={"input-field col s4 center-align"}>
                                                <span>{this.state.info.departure} to {this.state.info.arrival}</span>
                                            </div>
                                            <div className={"input-field col s2"}>
                                                <select defaultValue={'class'} className=""
                                                        onChange={this.handleSelectChange}>


                                                    <option disabled value="class">Class</option>
                                                    <option value="A"
                                                            disabled={this.state.info.A === 0 ? true : null}>Class A
                                                    </option>
                                                    <option value="B" disabled={this.state.info.B === 0}>Class B
                                                    </option>
                                                    <option value="C" disabled={this.state.info.C === 0}>Class C
                                                    </option>

                                                </select>
                                            </div>
                                            <div className={"input-field col s2"}>
                                                <input type="number" min="0" value={this.state.seats}
                                                       onChange={this.onChange}
                                                />
                                            </div>


                                        </div>

                                        <div>
                                            <button className="ml-5 waves-effect waves-light btn cyan accent-4"
                                                    onClick={this.addPromo}>
                                                <i className="material-icons left">rss_feed</i>
                                                Add Promo
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                {this.state.inputs.class !== "unknown" && this.state.seats !== "" ? summary : ''}
                            </div>
                            {this.state.inputs.class !== "unknown" && this.state.seats !== "" ? cardAction : ''}

                        </div>
                    </div>
                </div>

                <div id="modal2" className="modal">

                    <div className="modal-title"><h4>Pay to Dialog Monthly Bill</h4></div>

                    <div className="modal-content">

                        <h5>Amount:LKR {this.state.grandtotal}</h5>

                        <div className="row">
                            <form className="col s12">
                                <div className="row">
                                    <div className="input-field col s6">
                                        <i className="material-icons prefix">phone</i>
                                        <input id="icon_telephone" type="tel" name={"telephone"} className="validate"
                                        value={this.state.telephone} onChange={this.onChangeForDialog}
                                        />
                                            <label htmlFor="icon_telephone">Telephone</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <i className="material-icons prefix">lock</i>
                                        <input id="icon_prefix" type="text" name="pin" className="validate" min={4} max={4}
                                               value={this.state.pin} onChange={this.onChangeForDialog}
                                        />
                                        <label htmlFor="icon_prefix">Pin</label>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-green btn-flat" onClick={this.payDialog}>Pay</button>
                    </div>
                </div>

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

export default reservation

import React, {Component} from 'react'
import {fn_getReservationByUID} from '../functions/scheduleFunctions';
import {validateUser} from "../functions/userFunctions";
import swal from "@sweetalert/with-react";

var context;
class myReservations extends Component{


    constructor(props){
        super(props);
        this.state={
            reservationList:[]
        }
    }

    componentDidMount() {
        document.title = "My Reservations";

        let user =JSON.parse(localStorage.getItem('user'));
        context = this;

        //validate user id and page user id if it is wrong redirect to users reservation page

        if(user._id !== this.props.match.params.id){
            this.props.history.push('/user/reservation/'+user._id);
            window.location.reload();
        }else {

            //get reservation list
            fn_getReservationByUID(user._id).then(data => {
                data = data.data;
                this.setState({
                    reservationList: data.reservation
                });

            }).catch(err => {
                console.log(err)
            });


            //validate user
            //validating user
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

        }

    }


    render() {
        return(
            <div>
                {this.state.reservationList.map(function (value, index) {

                    return(
                        value.reservation.map( (val,index) =>{
                                return(
                                    <div className="row" key={index}>
                                        <div className="col s12 m12">
                                            <div className="card grey lighten-4 z-depth-3">
                                                <div className="card-content black-text">

                                                    <div className="row">
                                                        <div className="col s4">
                                                            <div className="row">
                                                                <span className="card-title font-bold">{value.trainName}</span>
                                                                <span className="green-text text-accent-4">{value.route.from.station} to {value.route.to.station}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col s8 right-align">
                                                            <b>Reservation ID: </b>
                                                            <span className="blue-text text-darken-2">
                                                            {val._id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col s3">
                                                            <span className="font-italic">
                                                                {val.route.from} to {val.route.to}
                                                            </span>
                                                        </div>
                                                        <div className="col s3">
                                                            {val.date}
                                                        </div>
                                                        <div className="col s3">Class {val.seats.class}</div>
                                                        <div className="col s3">{val.seats.noSeats} tickets</div>
                                                    </div>

                                                    <div className={"row"}>
                                                        <div className="col s6">
                                                            %{val.payment.discount} discount
                                                        </div>
                                                        <div className="col s6 right-align">
                                                            <strong>
                                                            LKR {val.payment.total.$numberDecimal}</strong>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    )
                })}


            </div>
        )
    }
}
export default myReservations;

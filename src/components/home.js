import React, {Component} from 'react'
import moment from 'moment';
import M from 'materialize-css'
import {showRoutes} from './functions/trainRouteFunctions'
import {fn_checkAvailability} from './functions/trainFunctions'
import {Link} from 'react-router-dom'
import {fn_addSchedule, fn_getSpecificSchedule} from "./functions/scheduleFunctions";
import swal from '@sweetalert/with-react'

class home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stationList: [],
            trainList: [],
            departure: "",
            arrival: "",
            date: "Today",
            time: "Now",
            isAutoDeparture: false,
            isAutoArrival: false,
            modal: {header: "", body: ""},
            button: {check: "Check"},
            checkResult: {trainList: [], isActive: false,},
            availableSeats: {A: "", B: "", C: ""}

        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickRow = this.onClickRow.bind(this);
    }

    //handle modal table onClick which is handle train information
    onClickRow = (parameter, event) => {

        //assign selected row values
        let train = this.state.checkResult.trainList[parameter];

        //data variable is used for getting seats information from selected train
        let data = {
            _tid: train._id,
            date: moment(new Date(this.state.date)).format("MM-DD-YYYY"),
        };

        //fetching data
        fn_getSpecificSchedule(data).then(data => {
            let schedule = data.data.schedule;

            this.setState({
                availableSeats: {
                    A: schedule.availableSeats.A,
                    B: schedule.availableSeats.B,
                    C: schedule.availableSeats.C,
                }
            },()=>{

                //show information alert
                swal({
                    text: "Available Seat Information",
                    buttons: {
                        cancel: "Close",
                        ok: "Proceed",
                    },
                    content: (
                        <div>
                            <div className="left-align"><b>Class A:</b>{this.state.availableSeats.A}</div><br/>
                            <div className="left-align"><b>Class B:</b>{this.state.availableSeats.B}</div><br/>
                            <div className="left-align"><b>Class C:</b>{this.state.availableSeats.C}</div>
                        </div>
                    )
                }).then(value=>{
                    //handle alert onClick
                    if(value==="ok"){
                        this.props.history.push({
                                pathname : '/reservation',
                                state :{
                                    trainID : train._id,
                                    date: this.state.date,
                                    departure:this.state.departure,
                                    arrival:this.state.arrival,
                                    type:this.state.checkResult.trainList[parameter].type
                                }
                            }
                        );
                    }
                })

            });
        }).catch(err => {
            swal("Internal Error!", "Something went wrong!", "error");
        });
    };

    componentDidMount() {

        document.title = "Train Reservation System";
        var context = this;

        // Initilize date picker
        var date = new Date();
        var delems = document.querySelectorAll('#date');
        M.Datepicker.init(delems, {
            autoClose: true,
            minDate: date,
            defaultDate: date,
            onSelect: function (date) {

                context.setState({date: date})
            }
        });

        //initialize time picker
        var telems = document.querySelectorAll('.timepicker');
        M.Timepicker.init(telems, {
            twelveHour: false,
            onSelect: function (time, min) {
                context.setState({time: time + ":" + min})
            }
        });

        //initialize select option
        var sel_elems = document.querySelectorAll('select');
        M.FormSelect.init(sel_elems, {});


        //get all stations names from route function and set it for autocomplete text box

        showRoutes().then(data => {

            this.setState({trainList: data.data.line});

            this.state.trainList.forEach(data => {

                data.stations.forEach(station => {

                    if (!this.state.stationList.includes(station)) {

                        this.setState(prevState => ({
                            stationList: [...prevState.stationList, station]
                        }))
                    }
                });
            })
        });

        //initialize modal
        var elems_modal = document.querySelectorAll('.modal');
        M.Modal.init(elems_modal, {});
    }

    //this method handle text feilds changes
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            message: null, error: null,
            isAutoArrival: e.target.name !== "arrival",
            isAutoDeparture: e.target.name !== "departure"
        });
    }

    //this method handle form's submit
    onSubmit(e) {
        //changing button name
        this.setState({
            button: {check: "Checking"}
        });
        e.preventDefault();

        //assign modal into variable
        const instance = M.Modal.getInstance(document.querySelector('#modal1'));

        //setting up formData
        let data = {
            departure: this.state.departure,
            arrival: this.state.arrival,
        };

        //set date to object
        if (this.state.date === "Today") {
            data.date = moment().format('MM/DD/YYYY');
            data.day = moment().format('dddd');
            this.setState({
                date: moment(new Date(),).format('MM/DD/YYYY')
            })
        } else {
            let date = new Date(this.state.date);

            data.date = moment(date).format('MM/DD/YYYY');
            data.day = moment(date).format('dddd');
            this.setState({
                date: moment(date).format('MM/DD/YYYY')
            })
        }

        //check availability of the train which is given by user
        fn_checkAvailability(data).then(res => {
            let data = res.data;
            this.setState({
                checkResult: {
                    trainList: data.trains,
                    isActive: true,
                },
                button: {
                    check: "Check"
                },
                modal: {
                    header: "Train Schedule (" + data.trains.length + " Results Found)",
                    body: "Please Select..."
                }
            });

            //open the modal
            instance.open();
        }).catch(err => {

            this.setState({
                checkResult: {
                    isActive: false
                },
                modal: {
                    header: "Train Schedule (0 Result Found)",
                    body: "No Result Found"
                },
                button: {
                    check: "Check"
                }
            });

            //open the modal
            instance.open();
        })


    }


    render() {

        //set autocomplete textbox
        var departureElem = document.querySelectorAll('#departure');
        var arrivalElem = document.querySelectorAll('#arrival');
        var result = {};
        const context = this;

        if (this.state.stationList.length > 0) {
            result = Object.assign.apply(null, this.state.stationList.map(x => ({[x]: 0})));
        }
        M.Autocomplete.init(departureElem, {
            data: result,
            limit: 5,
            onAutocomplete: function (val) {
                context.setState({
                    departure: val,
                    isAutoDeparture: true
                });
            }
        });
        M.Autocomplete.init(arrivalElem, {
            data: result,
            limit: 5,
            onAutocomplete: function (val) {
                context.setState({
                    arrival: val,
                    isAutoArrival: true
                })
            }
        });

        var required = true;
        return (
            <div>
                <img className="bg" src={process.env.PUBLIC_URL + '/icon/bg.jpg'} alt="bg"/>

                <div className="col s12 m12 z-depth-3 mt-50">
                    <div className="card  grey lighten-1 mt-50">
                        <div className="card-content  blue-grey-text text-darken-5">
                            <form onSubmit={this.onSubmit}>
                                <div className={"row"}>
                                    <div className="input-field col s6">
                                        <i className="material-icons prefix">transfer_within_a_station</i>
                                        <input id="departure" type="text"
                                               className={`autocomplete ${this.state.isAutoDeparture ? 'inp-icon-check' : 'inp-icon-wrong'}`}
                                               name="departure"
                                               required={required} value={this.state.departure}
                                               onChange={this.onChange}/>
                                        <label htmlFor="departure">Station of Departure</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <i className="material-icons prefix">train</i>
                                        <input id="arrival" type="text"
                                               className={`autocomplete ${this.state.isAutoArrival ? 'inp-icon-check' : 'inp-icon-wrong'}`}
                                               name="arrival"
                                               value={this.state.arrival} onChange={this.onChange} required={required}/>
                                        <label htmlFor="arrival">Station of Arrival</label>
                                    </div>

                                </div>

                                <div className={"row"}>
                                    <div className={"col s6 input-field"}>
                                        <label htmlFor="date">When</label>
                                        <i className="material-icons prefix">today</i>
                                        <input type="text" className="datepicker" id="date"
                                               value={this.state.date} onChange={this.onChange} required={required}/>
                                    </div>
                                    {/*<div className={"col s2 input-field"}>*/}
                                    {/*    <label htmlFor="time">Time</label>*/}
                                    {/*    <i className="material-icons prefix">query_builder</i>*/}
                                    {/*    <input type="text" className="timepicker" id="time"*/}
                                    {/*           value={this.state.time} onChange={this.onChange} required={required}/>*/}
                                    {/*</div>*/}
                                    <div className={"col s6 "}>
                                        <button type='submit'
                                                className='col s12 btn btn-large deep-orange accent-3 z-depth-1-half'
                                                id="submit-orange"
                                                disabled={!(this.state.isAutoArrival && this.state.isAutoDeparture)}>
                                            {this.state.button.check}
                                        </button>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                {/*Modal Structure Show Results*/}
                <div id="modal1" className="modal modal-fixed-footer">
                    <div className="modal-content">
                        <h4>{this.state.modal.header}</h4>
                        <b>{this.state.modal.body}</b>


                        {this.state.checkResult.isActive ?
                            <table className={"highlight centered"}>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>{this.state.departure}</th>
                                    <th>{this.state.arrival}</th>
                                    <th>Line</th>
                                    <th>Type</th>
                                    <th>Available Classes</th>
                                </tr>
                                </thead>

                                <tbody>
                                {this.state.checkResult.trainList.map(function (item, index) {
                                    let departureObj = item.stations.filter(obj => {
                                        return obj.station === context.state.departure
                                    });
                                    let arrivalObj = item.stations.filter(obj => {
                                        return obj.station === context.state.arrival
                                    });

                                    let fromObj = item.stations.filter(obj => {
                                        return obj.station === item.from
                                    });
                                    let toObj = item.stations.filter(obj => {
                                        return obj.station === item.to
                                    });



                                    //if schedule is not selected then create new one and also return available seats

                                    let date = context.state.date;

                                    let data = {
                                        trainID: item._id,
                                        trainName: item.trainName,
                                        date: date,
                                        from: fromObj[0],
                                        to: toObj[0],
                                        A: item.seats.A,
                                        B: item.seats.B,
                                        C: item.seats.C,
                                    };
                                    fn_addSchedule(data).then(data => {
                                    }).catch(err => {
                                    });
                                    return (
                                        <tr key={index} onClick={context.onClickRow.bind(this, index)}>
                                            <td>{item.trainName}</td>
                                            <td>{item.from}</td>
                                            <td>{item.to}</td>
                                            <td>{departureObj.length !== 0 ?departureObj[0].time :''}</td>
                                            <td>{arrivalObj.length !== 0 ?arrivalObj[0].time :''}</td>
                                            <td>{item.line}</td>
                                            <td>{item.type}</td>
                                            <td>
                                                {item.seats.A !== "0" ? 'A ' : ''}
                                                {item.seats.C !== "0" ? 'B ' : ''}
                                                {item.seats.B !== "0" ? 'C ' : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>

                            : ''}
                    </div>
                    <div className="modal-footer">
                        <Link to="" className="modal-close waves-effect waves-green btn-flat">Close</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default home

import React, {Component} from 'react'
import moment from 'moment';
import M from 'materialize-css'
import {showRoutes} from './functions/trainRouteFunctions'
import {fn_checkAvailability} from './functions/trainFunctions'
import {Link} from 'react-router-dom'

class home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stationList: [],
            trainList: [],
            class: "A",
            departure: "Colombo",
            arrival: "Badulla",
            seats: "1",
            date: "Today",
            time: "Now",
            isAutoDeparture: true,
            isAutoArrival: true,
            modal: {header: "", body: ""},
            checkResult:{trainList:[],isActive:false}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {

        var context = this;
        // Initilize date,time,select fields
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

        var telems = document.querySelectorAll('.timepicker');
        M.Timepicker.init(telems, {
            twelveHour: false,
            onSelect: function (time, min) {
                context.setState({time: time + ":" + min})
            }
        });

        var sel_elems = document.querySelectorAll('select');
        M.FormSelect.init(sel_elems, {});


        //get all stations from route function

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

        var elems_modal = document.querySelectorAll('.modal');
        M.Modal.init(elems_modal, {});
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value, message: null, error: null});
        if (e.target.name === "arrival")
            this.setState({isAutoArrival: false});
        if (e.target.name === "departure")
            this.setState({isAutoDeparture: false});
    }

    handleSelectChange = (event) => {
        this.setState({
            class: event.target.value
        })
    };

    onSubmit(e) {
        e.preventDefault();

        const instance =M.Modal.getInstance(document.querySelector('#modal1'));

        let data = {
            departure: this.state.departure,
            arrival: this.state.arrival,
            seats: this.state.seats,
            time: this.state.time,
            class: this.state.class,
        };

        if (this.state.date === "Today") {
            data.date = moment().format('MM/DD/YYYY');
            data.day = moment().format('dddd')
        } else {
            let date = this.state.date;
            data.date = moment(date).format('MM/DD/YYYY');
            data.day = moment(date).format('dddd')
        }

        fn_checkAvailability(data).then(res => {
            let data = res.data;
            this.setState({
                checkResult:{
                    trainList:data.trains,
                    isActive: true
                },
                modal:{
                    header:"Train Schedule (" + data.trains.length + " Results Found)",
                    body:"Please Select..."}
            });
            instance.open();
        }).catch(err => {
            this.setState({checkResult:{isActive:false},modal:{header: "Train Schedule (0 Result Found)",body:"No Result Found"}});
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
            <div className={"container"}>
                <div className="col s12 m12 z-depth-3">
                    <div className="card grey lighten-5">
                        <div className="card-content  text-blue-grey text-darken-4">
                            <form onSubmit={this.onSubmit}>
                                <div className={"row"}>
                                    <div className="input-field col s5">
                                        <i className="material-icons prefix">transfer_within_a_station</i>
                                        <input id="departure" type="text"
                                               className={`autocomplete ${this.state.isAutoDeparture ? 'inp-icon-check' : 'inp-icon-wrong'}`}
                                               name="departure"
                                               required={required} value={this.state.departure}
                                               onChange={this.onChange}/>
                                        <label htmlFor="departure">Station of Departure</label>
                                    </div>
                                    <div className="input-field col s5">
                                        <i className="material-icons prefix">train</i>
                                        <input id="arrival" type="text"
                                               className={`autocomplete ${this.state.isAutoArrival ? 'inp-icon-check' : 'inp-icon-wrong'}`}
                                               name="arrival"
                                               value={this.state.arrival} onChange={this.onChange} required={required}/>
                                        <label htmlFor="arrival">Station of Arrival</label>
                                    </div>


                                    <div className={"col s2 input-field"}>
                                        <i className="material-icons prefix">group</i>
                                        <label htmlFor="seats">No. of Seats</label>
                                        <input type="number" min={1} className="validate" id="seats"
                                               value={this.state.seats} onChange={this.onChange} required={required}/>
                                    </div>
                                </div>

                                <div className={"row"}>
                                    <div className={"col s3 input-field"}>
                                        <label htmlFor="date">When</label>
                                        <i className="material-icons prefix">today</i>
                                        <input type="text" className="datepicker" id="date"
                                               value={this.state.date} onChange={this.onChange} required={required}/>
                                    </div>
                                    <div className={"col s2 input-field"}>
                                        <label htmlFor="time">Time</label>
                                        <i className="material-icons prefix">query_builder</i>
                                        <input type="text" className="timepicker" id="time"
                                               value={this.state.time} onChange={this.onChange} required={required}/>
                                    </div>
                                    <div className="input-field col s2">
                                        <i className="material-icons prefix">class</i>
                                        <select required={required} defaultValue={'class'}
                                                onChange={this.handleSelectChange}>
                                            <option value="class" disabled>Select</option>
                                            <option value="A">Class A</option>
                                            <option value="B">Class B</option>
                                            <option value="C">Class C</option>
                                        </select>
                                        <label>Class</label>
                                    </div>
                                    <div className={"col s5 "}>
                                        <button type='submit'
                                                className='col s12 btn btn-large deep-orange accent-3 z-depth-1-half'
                                                id="submit-orange"
                                                disabled={!(this.state.isAutoArrival && this.state.isAutoDeparture)}>
                                            Check
                                        </button>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                {/*Modal Structure */}
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
                                    <th>Available Seats(A)</th>
                                    <th>Available Seats(B)</th>
                                    <th>Available Seats(C)</th>
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

                                        return(
                                            <tr key={index}>
                                                <td>{item.trainName}</td>
                                                <td>{item.from}</td>
                                                <td>{item.to}</td>
                                                <td>{departureObj[0].time}</td>
                                                <td>{arrivalObj[0].time}</td>
                                                <td>{item.line}</td>
                                                <td>{item.type}</td>
                                                <td>{item.seats.A}</td>
                                                <td>{item.seats.B}</td>
                                                <td>{item.seats.C}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            :''}
                    </div>
                    <div className="modal-footer">
                        <Link to="#!" className="modal-close waves-effect waves-green btn-flat">Close</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default home

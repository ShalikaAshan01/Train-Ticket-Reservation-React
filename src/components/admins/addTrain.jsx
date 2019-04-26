import React, {Component} from 'react'
import M from 'materialize-css'
import {showRoutes} from '../functions/trainRouteFunctions';
import {validateUser} from "../functions/userFunctions";
import {fn_addTrain} from "../functions/trainFunctions";

var user = null;

class addTrain extends Component {
    componentDidMount() {
        M.AutoInit();

        //validating user
        user = localStorage.getItem('user');
        if (user != null) {
            user = JSON.parse(user);
            let data = {
                _id: user._id,
                _token: user._token
            };
            validateUser(data).then(res => {
                res = res.data;
                this.setState({
                    isAdmin: res.role !== "user"
                });
            }).catch(err => {
                this.props.history.push(`/error/500`);
            })
        } else {
            this.setState(
                {isAdmin: false}
            );
        }

        //fetch lines
        //fetch data
        showRoutes().then(data => {
            data = data.data;
            this.setState({
                lines: data.line
            });
        }).catch(err => {
            this.props.history.push(`/error/401`);
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            isAdmin: false,
            trainName: "",
            type: "",
            classA: "",
            classB: "",
            classC: "",
            line: "",
            from: "",
            to: "",
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value, message: null, error: null})
    }

    handleSelectChange = (event) => {
        this.setState({
            line: event.target.value
        })
    };


    onSubmit(e) {
        e.preventDefault();
        let data ={
            trainName:this.state.trainName,
            type: this.state.type,
            classA: this.state.classA,
            classB: this.state.classB,
            classC: this.state.classC,
            line: this.state.line,
            from: this.state.from,
            to: this.state.to,
            monday:this.refs.monday.checked
        };

        let frequency=[];
        //add days to frequency array
        if(this.refs.sunday.checked)
            frequency.push("Sunday");
        if(this.refs.monday.checked)
            frequency.push("Monday");
        if(this.refs.tuesday.checked)
            frequency.push("Tuesday");
        if(this.refs.wednesday.checked)
            frequency.push("Wednesday");
        if(this.refs.thursday.checked)
            frequency.push("Thursday");
        if(this.refs.friday.checked)
            frequency.push("Friday");
        if(this.refs.saturday.checked)
            frequency.push("Saturday");

        data.frequency = frequency;

        let stations_text = this.state.stations.split(',');

        let stations=[];

        stations_text.forEach(function(entry) {
            let temp = entry.split(":-");
            stations.push({
                station:temp[0],
                time:temp[1],
            })
        });

        let seats={
            A:this.state.classA,
            B:this.state.classB,
            C:this.state.classC
        };

        data.seats = seats;


        data.stations = stations;

        const config = {
            headers: {
                _id:user._id,
                _token:user._token
            }
        };

        fn_addTrain(data,config)
            .then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
        })

        console.log(data);
    }

    render() {
        var required = false;
        return (
            <div className="container">
                <div className="row">
                    <form className="col s12" onSubmit={this.onSubmit}>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="trainName" name="trainName" type="text" className="validate" required={required}
                                       value={this.state.trainName} onChange={this.onChange}
                                />
                                <label htmlFor="trainName">Train Name</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="type" name="type" type="text" className="validate" placeholder="ex:Express"
                                       required={required}
                                       value={this.state.type} onChange={this.onChange}
                                />
                                <label htmlFor="type">Train Type</label>
                            </div>
                        </div>

                        <b>
                            Train Frequency
                        </b>

                        <div className="row mt-5">
                            <label>
                                <input id="sunday" name="sunday" type="checkbox" ref="sunday"/>
                                <span className="checkbox-span">Sunday</span>
                            </label>

                            <label>
                                <input id="monday" name="monday" type="checkbox" ref="monday"/>
                                <span className="checkbox-span">Monday</span>
                            </label>

                            <label>
                                <input id="tuesday" name="tuesday" type="checkbox" ref="tuesday"/>
                                <span className="checkbox-span">Tuesday</span>
                            </label>

                            <label>
                                <input id="wednesday" name="wednesday" type="checkbox" ref="wednesday"/>
                                <span className="checkbox-span">Wednesday</span>
                            </label>

                            <label>
                                <input id="thursday" name="thursday" type="checkbox" ref="thursday"/>
                                <span className="checkbox-span">Thursday</span>
                            </label>

                            <label>
                                <input id="friday" name="friday" type="checkbox" ref="friday"/>
                                <span className="checkbox-span">Friday</span>
                            </label>

                            <label>
                                <input id="saturday" name="saturday" type="checkbox" ref="saturday"/>
                                <span className="checkbox-span">Saturday</span>
                            </label>
                        </div>

                        <b>
                            Seats
                        </b>

                        <div className="row">
                            <div className="input-field col s4">
                                <input id="classA" name="classA" type="number" className="validate" required={required}
                                       value={this.state.classA} onChange={this.onChange}
                                />
                                <label htmlFor="classA">Class A</label>
                            </div>
                            <div className="input-field col s4">
                                <input id="classB" name="classB" type="number" className="validate" required={required}
                                       value={this.state.classB} onChange={this.onChange}
                                />
                                <label htmlFor="classB">Class B</label>
                            </div>
                            <div className="input-field col s4">
                                <input id="classC" name="classC" type="number" className="validate" required={required}
                                       value={this.state.classC}
                                       onChange={this.onChange}/>
                                <label htmlFor="classC">Class C</label>
                            </div>
                        </div>

                        <b>Train Route</b>

                        <div className="row">
                            <div className="input-field col s4">


                                <select defaultValue={'line'} className="browser-default"
                                        onChange={this.handleSelectChange}>

                                    <option disabled value="line">Choose Train Line</option>
                                    {this.state.lines.map(function (items, index) {
                                        return (<option key={index} value={items.line}>{items.line}</option>)
                                    })}

                                </select>
                            </div>
                            <div className="input-field col s4">
                                <input id="from" name="from" type="text" className="validate" required={required}
                                       value={this.state.from}
                                       onChange={this.onChange}/>
                                <label htmlFor="from">From</label>
                            </div>
                            <div className="input-field col s4">
                                <input id="to" name="to" type="text" className="validate" required={required} value={this.state.to}
                                       onChange={this.onChange}/>
                                <label htmlFor="to">To</label>
                            </div>
                        </div>


                        <div className="row">
                            <div className="input-field col s12">
                            <textarea id="stations" name="stations" className="materialize-textarea"
                                      value={this.state.stations}
                                      onChange={this.onChange} required={required}/>
                                <label htmlFor="stations">Stations Name(Separate by comma)
                                    ex:Colombo:-14:20,Badulla:-03:12</label>
                            </div>
                        </div>

                        {/* buttons */}
                        <div className='row'>
                            <button type='submit' name='btn_login'
                                    className='col s12 btn btn-large waves-effect indigo'>Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default addTrain;

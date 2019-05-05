import React, {Component} from 'react'
import M from 'materialize-css'
import {addLineFunction} from '../functions/trainRouteFunctions';
import {validateUser} from '../functions/userFunctions';
var user;
class editLine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            line: '',
            to: '',
            from: '',
            stations: '',
            message:null,
            error:null
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange (e) {
        this.setState({ [e.target.name]: e.target.value ,message:null,error:null})
    }


    componentDidMount() {
        document.title = "Edit Line";
        M.AutoInit();
        alert("Not implemented");
        user = localStorage.getItem('user');
        if(user==null)
            this.props.history.push(`/signin`);
        else{
            user = JSON.parse(user);
            let data = {
                _id:user._id,
                _token:user._token
            };
            validateUser(data).then(res=>{
                res = res.data;
                if(res.role==="user"){
                    this.props.history.push(`/error/401`);
                }
            }).catch(err=>{
                this.props.history.push(`/error/500`);
            })
        }
    }

    onSubmit(event) {
        event.preventDefault();
        const data= {
            line: this.state.line,
            from: this.state.from,
            to: this.state.to,
            stations:this.state.stations.split(',')

        };

        const header = {
            headers: {
                _id:user._id,
                _token:user._token
            }
        };
        addLineFunction(data,header).then(res=>{
            this.setState({
                message:res.data.message,
                error:null
            })
        }).catch(err=>{

            this.setState({
                message:null,
                error:err
            })
        })
    }


    render() {
        return (
            <div>

                <div className="input-field col s12">
                    <i className="material-icons prefix">search</i>
                    <input id="search" name="search" type="text" className="validate"/>
                        <label htmlFor="search">Search by Line</label>
                </div>


                <div className={this.state.message!=null ? 'center-align msg msg-success z-depth-3 scale-transition' : ''} >
                    {this.state.message} </div>

                <div className={this.state.error!=null ? 'center-align msg msg-error z-depth-3 scale-transition' : ''} >
                    {this.state.error} </div>

                <form className="col s12" onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="input-field col s4">
                            <input id="line" name="line" type="text" className="validate" required value={this.state.line}
                                   onChange={this.onChange}/>
                            <label htmlFor="line">Line Name</label>
                        </div>
                        <div className="input-field col s4">
                            <input id="from" name="from" type="text" className="validate" required value={this.state.from}
                                   onChange={this.onChange} />
                            <label htmlFor="from">From</label>
                        </div>
                        <div className="input-field col s4">
                            <input id="to" name="to" type="text" className="validate" required value={this.state.to}
                                   onChange={this.onChange} />
                            <label htmlFor="to">To</label>
                        </div>
                    </div>

                    <b>
                        Stops
                    </b>

                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="stations" name="stations" className="materialize-textarea" value={this.state.stations}
                                      onChange={this.onChange} required/>
                            <label htmlFor="stations">Stations Name(Separate by comma) ex:Colombo,Badulla</label>
                        </div>
                    </div>

                    <b>
                        New Stations
                    </b>

                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="new" name="new" className="materialize-textarea" value={this.state.stations}
                                      onChange={this.onChange} required/>
                            <label htmlFor="new">Stations Name(Separate by comma) ex:Colombo,Badulla</label>
                        </div>
                    </div>
                    <b>
                        Closed Stations
                    </b>

                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="closed" name="closed" className="materialize-textarea" value={this.state.stations}
                                      onChange={this.onChange} required/>
                            <label htmlFor="closed">Stations Name(Separate by comma) ex:Colombo,Badulla</label>
                        </div>
                    </div>


                    {/* buttons */}
                    <div className='row'>
                        <button type='submit'
                                className='col s12 btn btn-large waves-effect green'>Update
                        </button>
                    </div>

                </form>
            </div>
        );
    }
}

export default editLine;

import React, {Component} from 'react'
import M from 'materialize-css';
import swal from '@sweetalert/with-react'
import {Link} from 'react-router-dom'

class reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                class: ""
            }
        }
    }

    componentDidMount() {
        document.title = "";

        if (localStorage.getItem('user') === null) {
            swal("Authentication Error", "Please Signin", "warning").then(val => {
                if (val) {
                    window.open('/signin', 'sharer', 'toolbar=0,status=0,width=800,height=600');
                }
            })
        }

        //Initialization
        //select
        var elems_select = document.querySelectorAll('select');
        M.FormSelect.init(elems_select, {});

    }

    handleSelectChange = (event) => {
        this.setState({
            inputs: {
                class: event.target.value
            }
        })
    };


    render() {
        console.log(this.props.location.state.trainID);
        return (
            <div className={"container"}>
                <div className="row valign-wrapper offset-m3">
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
                                                    <span>Yal Dewi(Jaffna to Colombo)</span><br/>
                                                    <span>Apr 28 2019</span>
                                                </Link>
                                            </div>

                                            <div className={"input-field col s4 center-align"}>
                                                <span>Kankasanturei to Kandy</span>
                                            </div>
                                            <div className={"input-field col s2"}>
                                                <select defaultValue={'class'} className=""
                                                        onChange={this.handleSelectChange}>

                                                    <option disabled value="class">Class</option>
                                                    <option value="a">Class A</option>
                                                    <option value="b">Class B</option>
                                                    <option value="c">Class C</option>

                                                </select>
                                            </div>
                                            <div className={"input-field col s2"}>
                                                <input type="number" min={1}/>
                                            </div>


                                        </div>

                                        <div>
                                            <button className="ml-5 waves-effect waves-light btn cyan accent-4">
                                                <i className="material-icons left">rss_feed</i>
                                                Add Promo
                                            </button>
                                        </div>

                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col s12 m12">
                                        <div className="card blue-grey darken-1 z-depth-5">
                                            <div className="card-content white-text">
                                                <b className="card-title">Summary</b>

                                                <div className="row">
                                                    <div className="col s4"></div>
                                                    <div className="col s4">
                                                        <span className="center-align">Class A (175) * 3</span><br/>
                                                        <span
                                                            className="center-align font-italic">(Express Train)</span>
                                                    </div>
                                                    <div className="col s4 right-align">
                                                        <span>:750</span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col s4"></div>
                                                    <div className="col s4">
                                                        <b className="center-align">Discount %5 off</b>
                                                    </div>
                                                    <div className="col s4 right-align">
                                                        <b> -50</b>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col s4"></div>
                                                    <div className="col s4">
                                                        <h4 className="">Grand Total</h4>
                                                    </div>
                                                    <div className="col s4 right-align">
                                                        <h4>LKR 750</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="card-action">

                                <div className="left-align">
                                    <button className="ml-5 waves-effect waves-light btn red accent-2">
                                        <i className="material-icons left">reply_all</i>
                                        Go Back
                                    </button>
                                </div>
                                <div className="right-align row">
                                    <button className="waves-effect waves-light btn inp-icon-dialog amber accent-4">
                                        Credit the monthly bill
                                    </button>
                                    <button className="ml-5 waves-effect waves-light btn green accent-4">
                                        <i className="material-icons left">credit_card</i>
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default reservation

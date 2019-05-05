import React, {Component} from 'react'
import {Link} from "react-router-dom";

class signout extends Component{

    onClick = ()=>{
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
        window.location.reload();
    };
    componentDidMount() {
        document.title = "Signout";
    }

    render() {
        return(
            <div className="container">
                <div className="row mt-50">
                    <div className={"col s2"}> </div>
                    <div className="col s8 m12">
                        <div className="card ">
                            <div className="card-content black-text">
                                <h5 className="">Confirm: Sign out</h5>
                                <h5>
                                    You are already logged in as
                                    <span className="font-bold font-italic">
                                         {
                                             " " +
                                             JSON.parse(localStorage.getItem('user')).firstName +" "+
                                             JSON.parse(localStorage.getItem('user')).lastName +" "

                                        }
                                    </span>
                                    ,
                                    you need to log out before logging in as different user.
                                </h5>
                            </div>
                            <div className="card-action">
                                <Link to="/" className="waves-effect waves-light btn amber accent-4">Cancel</Link>
                                <button className="ml-5 waves-effect waves-light btn green accent-4" onClick={this.onClick}>Sign out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default signout;

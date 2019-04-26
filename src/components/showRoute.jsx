import React, {Component} from 'react'

import M from 'materialize-css'
import {showRoutes} from './functions/trainRouteFunctions';
import { Link } from 'react-router-dom'
import {validateUser} from "./functions/userFunctions";

let i=0,j=0,user=null;
class showRoute extends Component {
    componentDidMount() {
        M.AutoInit();
        //fetch data
        showRoutes().then(data=>{
            data = data.data;
            this.setState({
                items:data.line
            });
        }).catch(err=>{
            this.props.history.push(`/error/401`);
        });


        //validating user
        user = localStorage.getItem('user');
        if(user!=null){
            user = JSON.parse(user);
            let data = {
                _id:user._id,
                _token:user._token
            };
            validateUser(data).then(res=>{
                res = res.data;
                this.setState({
                    isAdmin : res.role !== "user"
                });
            }).catch(err=>{
                this.props.history.push(`/error/500`);
            })
        }else{
            this.setState(
                {isAdmin:false}
            );
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            items:[],
            isAdmin:false
        };
    }

    render() {
        var link;
        if(this.state.isAdmin)
            link =<Link to="admin/line/edit" className="btn-floating ml-5 btn- waves-effect waves-light green"><i className="material-icons">edit</i></Link>
        else
            link ="";
        i=0;
        return(
            <div className="container">
                <h3 className="blue-text text-accent-4">List of railway stations in Sri Lanka by line
                    {link}
                </h3>
                <ul>
                    {this.state.items.map(function (item,index) {
                        j=0;
                        return (<li key={item._id}><h4 className="blue-grey-text text-darken-4">{++i+"). "+item.line}</h4>

                            <h5 className="font-bold light-blue-text text-darken-3">{item.from} to {item.to}</h5>


                            {item.stations.map(function (name,index){
                                j++;
                                    return <p key={i+"."+j} className="blue-grey-text text-darken-4">{i+"."+j+"). "+name}</p>
                            })}
                        </li>);
                    })}
                </ul>


            </div>
        )
    }

}
export default showRoute;

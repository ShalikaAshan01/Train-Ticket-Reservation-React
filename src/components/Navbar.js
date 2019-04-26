import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
class Navbar extends Component{

    render() {
        return(
            <div>
                <nav>
                    <div className="nav-wrapper">
                        <Link to="#!" className="brand-logo">Logo</Link>
                        <Link to="#" data-target="mobile-demo" className="sidenav-trigger"><i
                            className="material-icons">menu</i></Link>
                        <ul className="right hide-on-med-and-down">
                            <li><Link to="sass.html">Sass</Link></li>
                            <li><Link to="badges.html">Components</Link></li>
                            <li><Link to="collapsible.html">Javascript</Link></li>
                            <li><Link to="mobile.html">Mobile</Link></li>
                        </ul>
                    </div>
                </nav>

                <ul className="sidenav" id="mobile-demo">
                    <li><Link to="sass.html">Sass</Link></li>
                    <li><Link to="badges.html">Components</Link></li>
                    <li><Link to="collapsible.html">Javascript</Link></li>
                    <li><Link to="mobile.html">Mobile</Link></li>
                </ul>
            </div>
        )
    }
}

export default withRouter(Navbar)

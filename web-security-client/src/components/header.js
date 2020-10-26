import React from "react";
import {Link} from 'react-router-dom'
import './header.css'

export default class Header extends React.Component {
  render() {
    return (<nav className="top-nav">
      <div className="nav-wrapper container">
        <Link className="page-title" to="/"><span>昨日头条</span></Link>
      </div>
    </nav>);
  }
}

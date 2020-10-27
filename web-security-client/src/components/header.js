import React from "react";
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import './header.css'
import styled from 'styled-components'

// css in js demo
const Span = styled.span` 
  float: right;
  font-size: 18px;
`

export default connect(
  loginInfo => ({ loginInfo }),
)(class extends React.Component {
  toLogin () {
    this.props.history.push('/user/login')
  }
  render() {
    const {id, username} = this.props.loginInfo
    return (<nav className="top-nav">
      <div className="nav-wrapper container">
        <Link className="page-title" to="/"><span>昨日头条</span></Link>
        {!id ? <Link className="right" to='/user/login'>请登录</Link> : <Span>欢迎您：{username}</Span>}
      </div>
    </nav>);
  }
})

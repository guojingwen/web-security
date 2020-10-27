import React from 'react'
import ajax from '../ajax'
import { connect } from "react-redux";

export default connect(
  userInfo => ({ userInfo }),
)(class extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  login () {
    ajax({
      path: '/doLogin',
      method: 'POST',
      data: {
        username: this.state.username,
        password: this.state.password
      }
    }).then(res => {
      console.log(res)
      this.props.dispatch({
        type: "doLogin",
        loginInfo: res.data
      })
      this.props.history.push('/')
    })
  }

  render () {
    const { num } = this.props;

    const {username, password} = this.state
    return <div className="loginWrapper container">
      <div className="row section">
        <div className="col s6 offset-s3">
          <h4>登录{num}</h4>
          <div className="input-field">
            <input name="username" type="text" placeholder="用户名" value={username} onChange={e => this.setState({
              username: e.target.value
            })}/>
          </div>
          <div className="input-field">
            <input name="password" type="text" placeholder="密码" value={password} onChange={e => this.setState({
              password: e.target.value
            })}/>
          </div>
          <div className="input-field">
            <button className="waves-effect waves-light btn" onClick={() => this.login()}>登录</button>
          </div>
        </div>
      </div>
    </div>
  }
})

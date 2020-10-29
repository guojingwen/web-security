import React from 'react'
import ajax from '../ajax'
import { connect } from "react-redux";
import Config from '../config'
import md5 from 'js-md5'

export default connect(
  userInfo => ({ userInfo }),
)(class extends React.Component {
  constructor() {
    super();
    this.state = {
      isRegisterPage: false,
      username: '',
      password: '',
      captchaUrl: `${Config.captchaBase}?ts=${new Date().getTime()}`,
      captcha: ''
    }
  }

  static getDerivedStateFromProps (props, state){
    const obj = {isRegisterPage: false}
    if(props.match.path === '/user/register') {
      obj.isRegisterPage = true
    }
    return obj
  }
  go(path) {
    this.props.history.push(path)
    this.changeCaptcha()
  }

  validate() {
    const {username, password, captcha} = this.state
    if(!username) {
      return showToast('用户名不能为空')
    }
    if (!password) {
      return showToast('密码不能为空')
    }
    if (!captcha.trim()) {
      return showToast('验证码不能为空')
    }
    return true
  }
  login () {
    const {username, password, captcha} = this.state
    if(!this.validate()) return
    ajax({
      path: '/doLogin',
      method: 'POST',
      data: {
        username,
        password: encrypt(username, password),
        captcha: captcha.trim()
      }
    }).then(res => {
      showToast('登录成功')
      this.props.dispatch({
        type: "doLogin",
        loginInfo: res.data
      })
      this.props.history.push('/')
    }).catch(e => {
      this.changeCaptcha()
    })
  }
  register () {
    const {username, password, captcha} = this.state
    if(!this.validate()) return
    ajax({
      path: '/doRegister',
      method: 'POST',
      data: {
        username,
        password: encrypt(username, password), // 前端加密也存在一定意义
        captcha: captcha.trim()
      }
    }).then(res => {
      showToast('注册成功')
      this.props.dispatch({
        type: "doLogin",
        loginInfo: res.data
      })
      this.props.history.push('/')
    }).catch(e => {
      this.changeCaptcha()
    })
  }

  changeCaptcha() {
    this.setState({
      captchaUrl: `${Config.captchaBase}?ts=${new Date().getTime()}`
    })
  }

  render () {
    const {username, password, captcha, captchaUrl, isRegisterPage} = this.state
    return <div className="loginWrapper container">
      <div className="row section">
        <div className="col s6 offset-s3">
          <h4>{isRegisterPage ? '注册' : '登录'}</h4>
          <div className="input-field">
            <input name="username" type="text" placeholder="用户名" value={username} onChange={e => this.setState({
              username: e.target.value
            })}/>
          </div>
          <div className="input-field">
            <input name="password" type="password" placeholder="密码" value={password} onChange={e => this.setState({
              password: e.target.value
            })}/>
          </div>
          <div className="input-field">
            <input name="captcha" type="text" placeholder="验证码" value={captcha} onChange={e => this.setState({
              captcha: e.target.value
            })}/>
            <img src={captchaUrl} alt="验证码" onClick={() => this.changeCaptcha()}/>
          </div>
          <div className="input-field">
            {
              isRegisterPage ?
                <button className="waves-effect waves-light btn" onClick={() => this.register()}>注册</button>
                :
                <button className="waves-effect waves-light btn" onClick={() => this.login()}>登录</button>
            }
          </div>
        </div>
        <div className="col s6 offset-s3">
          {!isRegisterPage ? <a onClick={() => this.go('/user/register')}>注册</a> : <a onClick={() => this.go('/user/login')}>登录</a> }
        </div>
      </div>
    </div>
  }
})

function encrypt(username, password) {
  return md5(username + '!$$@@#%dasd@$' + password)
}

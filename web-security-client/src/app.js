import React from 'react'
import {connect} from "react-redux";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Post from "./pages/post";
import UserLogin from "./pages/user-login";
import Home from "./pages/home";
import showToast from './components/toast'
import 'materialize-css/dist/css/materialize.css'
import './main.css';
import ajax from './ajax'
window.showToast = showToast

export default connect(
  userInfo => ({ userInfo }),
)(class App extends React.Component{
  constructor() {
    super();
    this.state = {
      hadLoadConfig: false
    }
  }
  componentDidMount() {
    // eslint-disable-next-line no-restricted-globals
    if(top.location !== self.location) return // 不允许内嵌在iframe中

    const cookieObj = document.cookie.split(';').reduce((sum, item) => {
      let [key, value] = item.split('=')
      value && (sum[key.trim()] = value)
      return sum
    }, {})
    ajax({
      path: '/getLoginInfo',
    }).then(res => {
      res.data && this.props.dispatch({
        type: "doLogin",
        loginInfo: res.data
      })
      this.setState({
        hadLoadConfig: true
      })
    })
  }

  render() {
    return this.state.hadLoadConfig ? <Router>
          <Switch>
            <Route path="/post/:postId" component={Post}></Route>
            <Route path="/user/login" component={UserLogin}></Route>
            <Route path="/user/register" component={UserLogin}></Route>
            <Route path="/" component={Home}></Route>
            <Route component={EmptyPage} />
          </Switch>
        </Router> : <span>加载中</span>
  }
})

class EmptyPage extends React.Component {
  render() {
    return (
      <div>
        <h3>EmptyPage-404</h3>
      </div>
    );
  }
}

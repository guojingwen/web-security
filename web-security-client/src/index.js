import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import 'materialize-css/dist/css/materialize.css'
import './main.css';
import Home from './pages/home'
import Post from './pages/post'
// import * as serviceWorker from './serviceWorker';

class EmptyPage extends React.Component {
  render() {
    return (
      <div>
        <h3>EmptyPage-404</h3>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/post/:postId" component={Post}></Route>
          <Route path="/" component={Home}></Route>
          <Route component={EmptyPage} />
        </Switch>
      </Router>
    </Provider>

  </React.StrictMode>,
  document.getElementById('root')
);




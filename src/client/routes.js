import {
  Router,
  Switch
} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import LazyRoute from './components/Basic/LazyRoute';

const {
  createBrowserHistory
} = require('history');

const history = createBrowserHistory();
const Routes = () => (
  <Router history={history} >
    <Switch >
      <LazyRoute exact path="/" component={() => import('./App')} />
      <LazyRoute exact path="/App" component={() => import('./App')} />
    </Switch>
  </Router>);

export default Routes;

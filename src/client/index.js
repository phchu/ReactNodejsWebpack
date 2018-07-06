import { Switch, Router } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import LazyRoute from './components/Basic/LazyRoute';

const history = createBrowserHistory();
ReactDOM.render(
  <Router history={history}>
    <Switch>
      <LazyRoute exact path="/" component={() => import('./App')} />
      <LazyRoute exact path="/App" component={() => import('./App')} />
    </Switch>
  </Router>
  , document.getElementById('root')
);

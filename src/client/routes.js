import React, { useEffect } from 'react';
import {
  Router,
  Switch
} from 'react-router-dom';
import _ from 'lodash';

import { useStore } from './store';
import LazyRoute from './components/Basic/LazyRoute';
import useAuth from './hooks/useAuth';

const {
  createBrowserHistory
} = require('history');

const history = createBrowserHistory();

const Routes = () => {
  const [{ auth }] = useStore();
  const { checkAuth, checkExpiration } = useAuth();
  const token = localStorage.getItem('token');
  const user = _.get(auth, 'user._id');
  checkExpiration();
  useEffect(() => {
    checkAuth(token);
  }, [token]);
  return (
    <Router history={history} >
      <Switch >
        {user && token ? <LazyRoute exact component={() => import('./App')} /> : <LazyRoute exact component={() => import('./pages/Auth')} />}
      </Switch>
    </Router>);
};

export default Routes;

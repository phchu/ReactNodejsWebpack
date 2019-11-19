import { Query } from 'react-apollo';
import {
  Route,
  Router,
  Switch
} from 'react-router-dom';
import _ from 'lodash';
import React from 'react';

import { GET_AUTH_USER } from './graphql/user';
import { SET_AUTH_USER } from './store/auth';
import { useStore } from './store';
import Auth from './pages/Auth';
import LazyRoute from './components/Basic/LazyRoute';
import Loading from './components/Basic/PageLoading';

const {
  createBrowserHistory
} = require('history');

const history = createBrowserHistory();

const Routes = () => {
  const [{ auth }, dispatch] = useStore();
  const user = _.get(auth, 'user._id');
  const token = localStorage.getItem('token');
  return (
    <Query
      query={GET_AUTH_USER}
      fetchPolicy="cache-and-network"
      onCompleted={data => dispatch({ type: SET_AUTH_USER, payload: data.getAuthUser })
      }
    >
      {({ loading, refetch }) => {
        if (loading) return <Loading />;
        return (
          <Router history={history} >
            <Switch >
              {user && token ? <LazyRoute exact component={() => import('./App')} /> : <Route exact render={() => <Auth refetch={refetch} />} />
              }
            </Switch>
          </Router>
        );
      }
      }
    </Query>
  );
};

export default Routes;

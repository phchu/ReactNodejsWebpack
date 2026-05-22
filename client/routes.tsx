import { useQuery } from '@apollo/client';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import _ from 'lodash';
import React, { useEffect } from 'react';

import { GET_AUTH_USER } from './queries/user';
import { SET_AUTH_USER } from './store/auth';
import { useStore } from './store';
import Auth from './pages/Auth';
import App from './App';
import Loading from './components/Basic/PageLoading';

const Routes = () => {
  const [{ auth }, dispatch] = useStore();
  const user = _.get(auth, 'user._id');
  const token = localStorage.getItem('token');

  const { loading, data, refetch } = useQuery(GET_AUTH_USER, {
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (data && data.getAuthUser) {
      dispatch({ type: SET_AUTH_USER, payload: data.getAuthUser });
    }
  }, [data, dispatch]);

  if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <RouterRoutes>
        {user && token ? (
          <Route path="/*" element={<App />} />
        ) : (
          <Route path="/*" element={<Auth refetch={refetch} />} />
        )}
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;

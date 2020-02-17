import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import React from 'react';

import PageLoading from './PageLoading';

const LazyRoute = props => {
  const loading = ({ isLoading, error }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    if (error) {
      console.error(error);
      return <div>Sorry, there was a problem loading the page.</div>;
    }
    return null;
  };
  const { component: loader } = props;
  const component = Loadable({
    loader,
    loading
  });

  return <Route {...props} component={component} />;
};

export default LazyRoute;

LazyRoute.defaultProps = {
  isLoading: true,
  error: null
};
LazyRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object
};

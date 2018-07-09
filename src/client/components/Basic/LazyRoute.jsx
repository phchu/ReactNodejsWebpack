import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import React from 'react';

import Loading from './PageLoading';

const LazyRoute = (props) => {
  const component = Loadable({
    loader: props.component,
    loading: ({ isLoading, error }) => {
      if (isLoading) {
        return Loading;
      } else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
      } return null;
    }
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

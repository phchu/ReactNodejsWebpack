import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { PERMISSION } from '../config/menu';
import Default from './components/Default';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';

export default () => (
  <MainLayout>
    <Switch>
      <Route exact path="/" component={Default} />
      <Route exact path={PERMISSION.URL} component={Default} />
      <Route component={NotFound} />
    </Switch>
  </MainLayout>
);

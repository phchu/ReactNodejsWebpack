import { Route, Switch } from 'react-router-dom';
import React from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';

export default () => (
  <Switch>
    <Route exact path="/signin" component={SignIn} />
    <Route exact path="/signup" component={SignUp} />
    <Route component={SignIn} />
  </Switch>
);

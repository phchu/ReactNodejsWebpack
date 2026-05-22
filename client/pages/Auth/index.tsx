import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';

const Auth = ({ refetch }) => (
  <Routes>
    <Route path="/signin" element={<SignIn refetch={refetch} />} />
    <Route path="/signup" element={<SignUp refetch={refetch} />} />
    <Route path="*" element={<SignIn refetch={refetch} />} />
  </Routes>
);

Auth.propTypes = {
  refetch: PropTypes.func.isRequired
};

export default Auth;

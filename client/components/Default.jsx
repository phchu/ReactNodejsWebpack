import { Icon } from 'react-fa';
import React from 'react';

import logo from '../assets/images/index.jpg';

const Default = () => (
  <div>
    <h1><span><Icon spin name="spinner" />  </span>Loading...please wait!</h1>
    <img alt="logo" style={{ width: 100 }} src={logo} />
  </div>
);

export default Default;

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

import logo from '../assets/images/index.jpg';

const Default = () => (
  <div>
    <h1>
      <span>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />{' '}
      </span>
      Loading...please wait!
    </h1>
    <img alt="logo" style={{ width: 100 }} src={logo} />
  </div>
);

export default Default;

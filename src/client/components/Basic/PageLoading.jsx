import { Spin } from 'antd';
import React from 'react';

const PageLoading = () => (
  <div className="redirect-url"><Spin tip="頁面載入中..." size="large" /></div>
);

export default PageLoading;

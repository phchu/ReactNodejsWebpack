import { Routes, Route } from 'react-router-dom';
import React from 'react';

import { PERMISSION } from '../config/menu';
import Default from './components/Default';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';

const App = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Default />} />
      <Route path={PERMISSION.URL} element={<Default />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </MainLayout>
);

export default App;

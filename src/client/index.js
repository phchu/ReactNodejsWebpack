import React from 'react';
import ReactDOM from 'react-dom';

import { StoreProvider } from './store';
import Routes from './routes';

ReactDOM.render(
  <StoreProvider>
    <Routes />
  </StoreProvider>
  , document.getElementById('root')
);

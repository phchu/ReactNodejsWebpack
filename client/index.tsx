import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import { StoreProvider } from './store';
import Routes from './routes';
import createApolloClient from './apollo-client';

const apolloClient = createApolloClient();
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ApolloProvider client={apolloClient}>
    <StoreProvider>
      <Routes />
    </StoreProvider>
  </ApolloProvider>
);

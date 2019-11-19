import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactDOM from 'react-dom';

import { StoreProvider } from './store';
import Routes from './routes';
import createApolloClient from './apollo-client';

const apolloClient = createApolloClient();

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <ApolloHooksProvider client={apolloClient}>
      <StoreProvider>
        <Routes />
      </StoreProvider>
    </ApolloHooksProvider>
  </ApolloProvider>
  , document.getElementById('root')
);

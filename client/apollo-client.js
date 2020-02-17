import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

/**
 * Creates a Apollo Link, that adds authentication token to request
 */
const createAuthLink = () => {
  const request = operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  };

  return new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer)
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );
};

/**
 * Helper functions that handles error cases
 */
const handleErrors = () =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.error('graphQLErrors', graphQLErrors);
    }
    if (networkError) {
      console.error('networkError', networkError);
    }
  });

/**
 * Creates a Apollo Client
 */
const createApolloClient = () => {
  const cache = new InMemoryCache();
  const authLink = createAuthLink();
  const httpLink = new HttpLink({ uri: '/graphql' });

  return new ApolloClient({
    link: ApolloLink.from([handleErrors(), authLink, httpLink]),
    cache
  });
};

export default createApolloClient;

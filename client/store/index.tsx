import React, { createContext, useContext, useReducer } from 'react';

import { authInitialState, authReducer } from './auth';

/**
 * React context for store
 */
const StoreContext = createContext();

/**
 * Combine initial states
 */
const initialStore = {
  auth: authInitialState
};

/**
 * Combine reducers
 */
const reducers = (store, action) => ({
  auth: authReducer(store.auth, action)
});

/**
 * Store context provider
 */
export const StoreProvider = ({ children }) => (
  <StoreContext.Provider value={useReducer(reducers, initialStore)}>
    {children}
  </StoreContext.Provider>
);

/**
 * React hook for consuming store
 */
export const useStore = () => useContext(StoreContext);

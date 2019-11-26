/**
 * Actions types
 */
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const CLEAR_AUTH_USER = 'CLEAR_AUTH_USER';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_OUT = 'SIGN_OUT';

/**
 * Initial State
 */
export const authInitialState = {
  user: null,
};

/**
 * User Reducer
 */
export const authReducer = (state = authInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SIGN_OUT:
      localStorage.removeItem('token');
      return true;
    case SIGN_UP:
    case SET_AUTH_USER:
      return {
        ...state,
        user: payload,
      };
    case CLEAR_AUTH_USER: {
      return {
        ...state,
        ...authInitialState,
      };
    }

    default:
      return state;
  }
};

import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import { CLEAR_AUTH_USER, SET_AUTH_USER, SIGN_IN, SIGN_UP } from '../store/auth';
import { useStore } from '../store';

const API = '/api/auth';

const useAuth = () => {
  const [{ auth }, dispatch] = useStore();
  const checkExpiration = () => {
    const exp = _.get(auth, 'user.exp');
    const isExpired = moment().isBefore(moment().unix(exp));
    if (exp && isExpired) {
      localStorage.removeItem('token');
      dispatch({ type: CLEAR_AUTH_USER });
    }
  };

  const checkAuth = async (token) => {
    let result;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(`${API}/user`, null, { headers });
      const { data } = response;
      const { err, data: user } = data;
      if (!err) {
        result = user;
        dispatch({ type: SET_AUTH_USER, payload: result });
      }
    } catch (error) {
      if (error.response) result = error.response.data;
      console.error('[ERROR]Auth failed.', error.message);
    }
    return result;
  };

  const signUp = async ({ name, email, password }) => {
    let result;
    try {
      const response = await axios.post(`${API}/signup`, { name, email, password });
      const { data } = response;
      const { err, data: user } = data;
      if (!err) {
        result = user;
        dispatch({ type: SIGN_UP, payload: result });
      }
    } catch (error) {
      if (error.response) result = error.response.data;
      console.error('[ERROR]Register failed.', error.message);
    }
    return result;
  };

  const signIn = async ({ email, password }) => {
    let result;
    try {
      const response = await axios.post(`${API}/signin`, { email, password });
      const { data } = response;
      const { err, data: user } = data;
      if (!err) {
        result = user;
        localStorage.setItem('token', user.accessToken);
        dispatch({ type: SIGN_IN });
      }
    } catch (error) {
      if (error.response) result = error.response.data;
      console.error('[ERROR]Login failed.', error.message);
    }
    return result;
  };
  return {
    checkAuth, signUp, signIn, checkExpiration
  };
};

export default useAuth;

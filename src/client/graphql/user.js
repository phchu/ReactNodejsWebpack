import gql from 'graphql-tag';

/**
 * Records to select from user
 */
const userPayload = `
  _id
  name
  email  
  createdAt
  updatedAt
`;

/**
 * Gets specific user by username
 */
export const GET_USER = gql`
  query($email: String!) {
    getUser(email: $email) {
      ${userPayload}
    }
  }
`;

/**
 * Gets authenticated user
 */
export const GET_AUTH_USER = gql`
  query {
    getAuthUser {
      ${userPayload} 
    }     
  }
`;

/**
 * Sign up user
 */
export const SIGN_UP = gql`
  mutation($input: SignUpInput!) {
    signup(input: $input) {
      ${userPayload}
    }
  }
`;

/**
 * Sign in user
 */
export const SIGN_IN = gql`
  mutation($input: SignInInput!) {
    signin(input: $input) {
      token
    }
  }
`;

import { gql } from 'apollo-server-express';

/**
 * GraphQL Schema that describes the main functionality of the API
 *
 * https://www.apollographql.com/docs/apollo-server/schema/schema/
 */

const schema = gql`
  # ---------------------------------------------------------
  # Model and Root Query Objects
  # ---------------------------------------------------------
  type User {
    _id: ID!
    name: String!
    email: String!
    username: String!
    password: String!
    createdAt: String
    updatedAt: String
  }

  type Token {
    token: String!
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input SignInInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    email: String!
    name: String!
    password: String!
  }

  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type UserPayload {
    _id: ID!
    email: String
    name: String
    createdAt: String
    updatedAt: String
  }

  # ---------------------------------------------------------
  # Query Root
  # ---------------------------------------------------------
  type Query {
    # Gets the currently logged in user
    getAuthUser: UserPayload

    # Gets user by username
    getUser(name: String!): UserPayload
  }

  # ---------------------------------------------------------
  # Mutation Root
  # ---------------------------------------------------------
  type Mutation {
    # Signs in user
    signin(input: SignInInput!): Token

    # Signs up user
    signup(input: SignUpInput!): UserPayload
  }
`;

export default schema;

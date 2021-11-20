import { gql } from "apollo-server-core";

export const typeDef = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    allUsers: [User!]!
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
  }
`;

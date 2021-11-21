import { gql } from "apollo-server-core";

export const typeDef = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type Query {
    allUsers: [User!]!
    getUser(id: Int!): User
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
    ): RegisterResponse
  }
`;

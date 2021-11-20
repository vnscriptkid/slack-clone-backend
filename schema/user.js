import { gql } from "apollo-server-core";

export const typeDef = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    allUsers: [String]
  }
`;

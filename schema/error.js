import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Error {
    path: String!
    message: String
  }
`;

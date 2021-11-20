import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Query {
    dummy: String
  }
`;

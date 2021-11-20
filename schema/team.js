import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;

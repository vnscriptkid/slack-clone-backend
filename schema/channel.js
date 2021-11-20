import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }
`;

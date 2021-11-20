import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
  }
`;

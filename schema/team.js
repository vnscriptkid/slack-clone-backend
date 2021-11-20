export const typeDef = `
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }
`;

export default {
  Mutation: {
    createTeam: async (parent, { name }, { models, user }) => {
      try {
        await models.Team.create({ name, owner: user.id });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};

import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createTeam: async (parent, { name }, { models, user }) => {
      try {
        await models.Team.create({ name, owner: user.id });
        return {
          ok: true,
        };
      } catch (e) {
        console.error(e);
        return {
          ok: false,
          errors: formatErrors(e),
        };
      }
    },
  },
};

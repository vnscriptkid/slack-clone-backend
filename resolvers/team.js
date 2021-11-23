import formatErrors from "../formatErrors";
import requireAuth from "../permissions";

export default {
  Mutation: {
    createTeam: requireAuth.createResolver(
      async (parent, { name }, { models, user }) => {
        try {
          await models.Team.create({ name, owner: user.id });
          return {
            ok: true,
          };
        } catch (e) {
          console.error(e);
          return {
            ok: false,
            errors: formatErrors(e, models),
          };
        }
      }
    ),
  },
};

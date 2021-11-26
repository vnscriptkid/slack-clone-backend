import formatErrors from "../formatErrors";
import requireAuth from "../permissions";

export default {
  Query: {
    allTeams: requireAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ owner: user.id }, { raw: true })
    ),
  },
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
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ teamId: id }),
  },
};

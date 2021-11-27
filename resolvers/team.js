import formatErrors from "../formatErrors";
import requireAuth from "../permissions";

export default {
  Query: {
    allTeams: requireAuth.createResolver(
      async (parent, args, { models, user }) =>
        models.Team.findAll({ where: { owner: user.id } }, { raw: true })
    ),
  },
  Mutation: {
    createTeam: requireAuth.createResolver(
      async (parent, { name }, { models, user }) => {
        try {
          const team = await models.Team.create({ name, owner: user.id });
          await models.Channel.create({
            name: "general",
            public: true,
            teamId: team.id,
          });

          return {
            ok: true,
            team,
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
      models.Channel.findAll({ where: { teamId: id } }),
  },
};

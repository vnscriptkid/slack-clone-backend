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
    addTeamMember: requireAuth.createResolver(
      async (parent, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true }
          );

          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );

          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);

          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "You cannot add members to the team",
                },
              ],
            };
          }

          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "Could not find user with this email",
                },
              ],
            };
          }

          await models.Member.create({ userId: userToAdd.id, teamId });

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
      models.Channel.findAll({ where: { teamId: id } }),
  },
};

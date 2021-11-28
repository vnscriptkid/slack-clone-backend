import formatErrors from "../formatErrors";
import requireAuth from "../permissions";

export default {
  Mutation: {
    createChannel: requireAuth.createResolver(
      async (parent, { teamId, name, public: isPublic }, { models, user }) => {
        const team = await models.Team.findOne({ where: { id: teamId } });
        const isOwner = team.owner === user.id;

        if (!isOwner) {
          return {
            ok: false,
            errors: [
              {
                path: "name",
                message:
                  "You have to be the owner of the team to create channel.",
              },
            ],
          };
        }

        try {
          const channel = await models.Channel.create({
            teamId,
            name,
            public: isPublic,
          });
          return {
            ok: true,
            channel,
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

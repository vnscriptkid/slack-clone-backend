import requireAuth from "../permissions";

export default {
  Query: {
    messages: requireAuth.createResolver(
      async (parent, { channelId }, { models, user }) => {
        // TODO: user must be authorized to see this channel
        return models.Message.findAll(
          {
            where: { channelId },
            order: [["created_at", "desc"]],
          },
          {
            raw: true,
          }
        );
      }
    ),
  },
  Mutation: {
    createMessage: requireAuth.createResolver(
      async (parent, { channelId, text }, { models, user }) => {
        try {
          await models.Message.create({
            userId: user.id,
            text,
            channelId,
          });
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    ),
  },
  Message: {
    user: ({ userId }, args, { models }) => {
      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
};

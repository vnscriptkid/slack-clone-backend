import requireAuth from "../permissions";

export default {
  Query: {
    messages: async (parent, args, { models, user }) => [],
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
};

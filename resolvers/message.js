export default {
  Mutation: {
    createMessage: async (parent, { channelId, text }, { models, user }) => {
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
    },
  },
};

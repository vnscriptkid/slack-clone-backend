export default {
  Mutation: {
    createChannel: async (
      parent,
      { teamId, name, public: isPublic },
      { models }
    ) => {
      try {
        await models.Channel.create({ teamId, name, public: isPublic });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};

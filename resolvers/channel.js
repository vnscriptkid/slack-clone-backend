import formatErrors from "../formatErrors";

export default {
  Mutation: {
    createChannel: async (
      parent,
      { teamId, name, public: isPublic },
      { models }
    ) => {
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
    },
  },
};

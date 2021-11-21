export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { id }, { models }) => models.User.findById(id),
  },
  Mutation: {
    register: async (parent, { username, email, password }, { models }) => {
      try {
        await models.User.create({ username, email, password });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};

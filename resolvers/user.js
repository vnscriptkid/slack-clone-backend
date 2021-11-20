export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { id }, { models }) => models.User.findById(id),
  },
  Mutation: {
    createUser: async (parent, args, { models }) =>
      models.User.create({ ...args }),
  },
};

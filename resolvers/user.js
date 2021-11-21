const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(({ path, message }) => ({ path, message }));
  }
  return [{ path: "name", message: "something went wrong" }];
};

export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { id }, { models }) => models.User.findById(id),
  },
  Mutation: {
    register: async (parent, { username, email, password }, { models }) => {
      try {
        await models.User.create({ username, email, password });
        return {
          ok: true,
          errors: null,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
  },
};

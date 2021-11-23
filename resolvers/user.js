import { tryLogin } from "../auth";
import formatErrors from "../formatErrors";

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
    login: (parent, { email, password }, { models }) =>
      tryLogin(email, password, models),
  },
};

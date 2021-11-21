import bcrypt from "bcrypt";

export default {
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    getUser: (parent, { id }, { models }) => models.User.findById(id),
  },
  Mutation: {
    register: async (parent, { username, email, password }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(
          password,
          Number(process.env.SALT_ROUNDS)
        );
        await models.User.create({ username, email, password: hashedPassword });
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};

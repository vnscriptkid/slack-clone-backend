import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "The username can only contain letters and numbers",
          },
          len: {
            args: [3, 25],
            msg: "The username needs to be between 3 and 25 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 20],
            msg: "The password needs to be between 5 and 20 characters long",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const hashedPassword = await bcrypt.hash(
            user.password,
            Number(process.env.SALT_ROUNDS)
          );
          user.password = hashedPassword;
        },
      },
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
    // N:M
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return User;
};

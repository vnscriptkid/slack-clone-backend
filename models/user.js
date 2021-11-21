import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
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
      through: "member",
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

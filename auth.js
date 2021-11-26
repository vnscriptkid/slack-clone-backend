import jwt from "jsonwebtoken";
import _ from "lodash";
import bcrypt from "bcrypt";

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ["id", "username"]),
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, "id"),
    },
    secret2,
    {
      expiresIn: "7d",
    }
  );

  return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models) => {
  let userId = 0;

  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) return {};

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) return {};

  const refreshSecret = buildRefreshTokenSecret(user);

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(
    user,
    process.env.JWT_SECRET,
    refreshSecret
  );
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{ path: "email", message: "Wrong email" }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: "password", message: "Wrong password" }],
    };
  }

  const [token, refreshToken] = await createTokens(
    user,
    process.env.JWT_SECRET,
    buildRefreshTokenSecret(user)
  );

  return {
    ok: true,
    token,
    refreshToken,
  };
};

function buildRefreshTokenSecret(user) {
  return user.password + process.env.JWT_SECRET2;
}

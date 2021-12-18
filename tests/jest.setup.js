import models from "../models";

global.url = "http://localhost:4001/graphql";

beforeEach(async () => {
  await models.User.destroy({ truncate: { cascade: true }, where: {} });
  await models.Channel.destroy({ truncate: { cascade: true }, where: {} });
  await models.Team.destroy({ truncate: { cascade: true }, where: {} });
});

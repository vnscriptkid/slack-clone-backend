import models from "../models";

test("1 + 1", async () => {
  expect(1 + 1).toBe(2);
  const users = await models.User.findAll();
  console.log({ users });
});

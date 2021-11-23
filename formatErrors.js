const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(({ path, message }) => ({ path, message }));
  }
  return [{ path: "name", message: "something went wrong" }];
};

export default formatErrors;

// findOne Email Query
export const findOneEmail = async (data) => {
  const { model, query } = data;

  const find = await model.findOne({ email: query });

  console.log("Model: ", model);
  console.log("Query: ", query);

  return find;
};

// Find all by role
export const findByRole = async (data) => {
  const { model, query } = data;
  const find = await model.find({ role: query });

  return find;
};

//Create One
export const createOne = async (data) => {
  const { model, query } = data;
  const create = await model.create( query );

  return create;
}
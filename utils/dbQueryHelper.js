export const findOneEmail = async (data) => {
  const { model, query } = data;
  const find = await model.findOne({ email: query });

  return find;
};

export const findByRole = async (data) => {
  const { model, query } = data;
  const find = await model.find({ role: query });

  return find;
};

export const findByID = async (data) => {
  const { model, query } = data;
  const find = await model.findOne({ email: query });

  return find;
};

export const findAll = async (data) => {
  const { model, query, select } = data;
  const find = await model.find(query).select(select ?? "");
  return find;
};

export const find = async ({ model, filter = {} }) => {
  const result = await model.find(filter);
  return result;
};

export const create = async ({model, data, options = {} }) => {
  const res = await model.create(data, options);
  console.log("Res: ", res);

  return res;
}

export const update = async (data) => {
  const { model, filter, update } = data;
  const result = await model.updateMany(filter, update);

  return result;
};

// Aggregate Query
// export const aggregateQuery = async (data) => {
//   const { model, query } = data;
//   const aggregate = await model.aggregate({});
// };

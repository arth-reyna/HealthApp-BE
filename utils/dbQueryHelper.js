export const find = async (data) => {
  const { model, filter } = data;
  const result = await model.find(filter);

  return result;
};

export const findOne = async (data) => {
  const { model, filter } = data;
  const result = await model.findOne(filter);
  return result;
};

export const create = async (data) => {
  const { model, data: createData } = data;
  const result = await model.create(createData);

  return result;
};

export const updateOne = async (data) => {
  const { model, filter, update, options = { new: true } } = data;
  const result = await model.findOneAndUpdate(filter, update, options);
  return result;
};

export const updateMany = async (data) => {
  const { model, filter, update } = data;
  const result = await model.updateMany(filter, { $set: update });

  return result;
};

export const findByIdAndUpdate = async (data) => {
  const { model, id, update, options = { new: true } } = data;
  const result = await model.findByIdAndUpdate(id, update, options);

  return result;
};

export const deleteOne = async (data) => {
  const { model, filter } = data;
  const result = await model.findOneAndDelete(filter);

  return result;
};

export const deleteMany = async (data) => {
  const { model, filter } = data;
  const result = await model.deleteMany(filter);

  return result;
};

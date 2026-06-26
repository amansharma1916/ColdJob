const SORT_MAP = {
  newest: '-createdAt',
  oldest: 'createdAt',
  az: 'name',
  za: '-name',
  recent: '-createdAt',
  '': '-createdAt',
};

export const buildMongooseQuery = async (Model, filter, queryParams) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit, 10) || 20));
  const sort = SORT_MAP[queryParams.sort] || queryParams.sort || '-createdAt';
  const search = queryParams.search || '';

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(skip).limit(limit),
    Model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
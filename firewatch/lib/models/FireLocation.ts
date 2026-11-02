// Stub implementation for build compatibility
const createChainableQuery = () => {
  const query: any = Promise.resolve([]);
  query.sort = () => createChainableQuery();
  query.limit = () => createChainableQuery();
  query.skip = () => createChainableQuery();
  query.select = () => createChainableQuery();
  query.lean = async () => [];
  return query;
};

export const FireLocation = {
  find: (...args: any[]) => createChainableQuery(),
  findOne: (...args: any[]) => ({
    lean: async () => null
  }),
  countDocuments: async (...args: any[]) => 0
};

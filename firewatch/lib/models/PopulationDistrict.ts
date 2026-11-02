// Stub implementation for build compatibility
const createChainableQuery = () => {
  let query = Promise.resolve([]) as any;
  query.sort = () => createChainableQuery();
  query.lean = () => createChainableQuery();
  query.limit = () => createChainableQuery();
  query.skip = () => createChainableQuery();
  return query;
};

export const PopulationDistrict = {
  find: (...args: any[]) => createChainableQuery(),
  aggregate: (...args: any[]) => createChainableQuery()
};

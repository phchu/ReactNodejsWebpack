const required = true;
const user = {
  name: 'name',
  description: 'User name',
  in: 'query',
  schema: {
    type: 'string'
  }
};

export default {
  requiredUser: {
    ...user,
    required
  },
  user
};

const createdAt = {
  type: 'integer',
  format: 'int32',
  description: 'Created timestamp'
};
const updatedAt = {
  type: 'integer',
  format: 'int32',
  description: 'Updated timestamp'
};

const UserInfo = {
  properties: {
    _id: {
      type: 'string',
      description: 'User unique ID'
    },
    name: {
      type: 'string',
      description: 'User name'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Email address'
    },
    mobile: {
      type: 'string',
      description: 'Mobile phone number'
    },
    createdAt,
    updatedAt
  },
  example: {
    _id: '5db01cdbcda929259473af91',
    name: 'phchu123',
    email: 'phchu@abc.com',
    createdAt: '1571822811325'
  }
};

const Token = {
  properties: {
    token: {
      type: 'string',
      description: 'JSON Web Tokens for authentication'
    }
  }
};

export default {
  UserInfo,
  Token
};

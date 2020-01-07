const err = {
  type: 'boolean',
  example: 'false'
};

const isErr = {
  type: 'boolean',
  example: 'true'
};

const userName = {
  name: 'name',
  description: 'User name',
  type: 'string'
};

const email = {
  name: 'email',
  description: 'Email address',
  type: 'string'
};

const password = {
  name: 'password',
  description: 'Account password',
  type: 'string'
};

const reqSignIn = {
  type: 'object',
  required: ['email', 'password'],
  properties: { email, password }
};

const reqSignUp = {
  type: 'object',
  required: ['email', 'name', 'password'],
  properties: { email, password, name: userName }
};

const req = {
  signIn: reqSignIn,
  signUp: reqSignUp
};

const resUnknownUser = {
  type: 'object',
  properties: {
    err: isErr,
    errMsg: {
      type: 'string',
      example: 'Unknown user.'
    }
  },
  example: {
    err: true,
    errMsg: 'Unknown user.'
  }
};

const resUserInfo = {
  type: 'object',
  properties: {
    err,
    data: {
      type: 'object',
      $ref: '#/definitions/UserInfo'
    }
  }
};

const resVerifyUser = {
  200: {
    type: 'object',
    properties: {
      err,
      data: {
        type: 'object',
        $ref: '#/definitions/UserInfo'
      }
    },
    example: {
      err: false,
      data: {
        _id: '5db01cdbcda929259473af91',
        name: 'phchu123',
        email: 'phchu@abc.com',
        createdAt: '1571822811325'
      }
    }
  },
  401: {
    type: 'object',
    properties: {
      err: isErr,
      errMsg: {
        type: 'string',
        example: 'Access denied. No token provided.'
      }
    },
    example: {
      err: true,
      errMsg: 'Access denied. No token provided.'
    }
  },
  403: {
    type: 'object',
    properties: {
      err: isErr,
      errMsg: {
        type: 'string',
        example: 'Unknown user.'
      }
    },
    example: {
      err: true,
      errMsg: 'Invalid token.'
    }
  }
};

const resSignIn = {
  200: {
    type: 'object',
    properties: {
      err,
      data: {
        type: 'object',
        $ref: '#/definitions/Token'
      }
    },
    example: {
      err: false,
      data: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGIwMWNkYmNkYTkyOTI1OTQ3M2FmOTEiLCJuYW1lIjoicGhjaHUxMjMiLCJpYXQiOjE1NzU0NTAwOTUsImV4cCI6MTU5MTAwMjA5NX0.8BFPthjYTBPosDzToCP4qPb1hNw-D7dKv28GYx2xyMo'
      }
    }
  },
  400: {
    invalidFields: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: '"email" length must be at least 6 characters long'
        }
      },
      example: {
        err: true,
        errMsg: '"email" length must be at least 6 characters long'
      }
    },
    unknownUser: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: 'User not found.'
        }
      },
      example: {
        err: true,
        errMsg: 'User not found.'
      }
    },
    invalidPassword: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: 'Invalid password.'
        }
      },
      example: {
        err: true,
        errMsg: 'Invalid password.'
      }
    }
  }
};

const resSignUp = {
  200: resUserInfo,
  400: {
    invalidFields: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: '"email" length must be at least 6 characters long'
        }
      },
      example: {
        err: true,
        errMsg: '"email" length must be at least 6 characters long'
      }
    },
    existedUser: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: 'User with given email already exists.'
        }
      },
      example: {
        err: true,
        errMsg: 'User with given email already exists.'
      }
    },
    invalidPassword: {
      type: 'object',
      properties: {
        err: isErr,
        errMsg: {
          type: 'string',
          example: 'Invalid password.'
        }
      },
      example: {
        err: true,
        errMsg: 'Invalid password.'
      }
    }
  }
};

const res = {
  unknownUser: resUnknownUser,
  userInfo: resUserInfo,
  signIn: resSignIn,
  signUp: resSignUp,
  verifyUser: resVerifyUser
};

export default { req, res };

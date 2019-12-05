import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { signInValidation, signUpValidation } from '../validation/auth';

const AUTH_TOKEN_EXPIRY = '180 days';
const generateToken = async (
  user,
  secret = process.env.TOKEN_SECRET,
  expiresIn = AUTH_TOKEN_EXPIRY
) => {
  const { _id, name } = user;
  return jwt.sign({ _id, name }, secret, { expiresIn });
};

const Query = {
  /**
   * Gets the currently logged in user
   */
  getAuthUser: async (root, args, { authUser, User }) => {
    if (!authUser) return null;
    const { _id: id } = authUser;
    const user = await User.findOne({ _id: id });
    return user;
  },
  /**
   * Gets user by username
   *
   * @param {string} name
   */
  getUser: async (root, { name }, { User }) => {
    const user = await User.findOne({ name });
    if (!user) {
      throw new Error("User with given username doesn't exists.");
    }
    return user;
  }
};

const Mutation = {
  /**
   * Signs in user
   *
   * @param {string} email
   * @param {string} password
   */
  signin: async (root, { input: { email, password } }, { User }) => {
    const { error } = signInValidation({ email, password });
    if (error) {
      throw error;
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password.');
    }

    return {
      token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY)
    };
  },
  /**
   * Signs up user
   *
   * @param {string} email
   * @param {string} name
   * @param {string} password
   */
  signup: async (root, { input: { email, name, password } }, { User }) => {
    const { error } = signUpValidation({ email, name, password });
    if (error) {
      throw error;
    }
    // Check if user with given email or username already exists
    const user = await User.findOne().or([{ email }, { name }]);
    if (user) {
      const field = user.email === email ? 'email' : 'name';
      throw new Error(`User with given ${field} already exists.`);
    }
    const newUser = await new User({ name, email, password }).save();
    const { _id, createdAt, updatedAt } = newUser;
    return { _id, name, email, createdAt, updatedAt };
  }
};

export default { Query, Mutation };

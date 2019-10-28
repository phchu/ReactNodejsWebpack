import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import { signInValidation, signUpValidation } from '../validation/auth';
import { wrapResult } from '../../operator/utils';
import User from '../../models/User';

const app = express.Router();
const AUTH_TOKEN_EXPIRY = '180 days';

const generateToken = async (user, secret = process.env.TOKEN_SECRET,
  expiresIn = AUTH_TOKEN_EXPIRY) => {
  const { _id } = user;
  return jwt.sign({ _id }, secret, { expiresIn });
};

app.post('/signup', async (req, res) => {
  let result;
  const { error } = signUpValidation(req.body);
  if (error) {
    res.status(400).json(wrapResult(error));
  }
  const { name, email, password } = req.body;
  // Check if Email exists
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    result = new Error('Email already exists.');
    res.status(400).json(wrapResult(result));
  }
  const user = new User({ name, email, password });
  try {
    result = await user.save();
  } catch (err) {
    result = err;
  }
  res.json(wrapResult(result));
});

app.post('/signin', async (req, res) => {
  let result;
  const { error } = signInValidation(req.body);
  if (error) {
    res.status(400).json(wrapResult(error));
  }
  const { email, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    result = new Error('Email doesn\'t exists.');
    res.status(400).json(wrapResult(result));
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    result = new Error('Invalid password.');
    res.status(400).json(wrapResult(result));
  }
  const accessToken = await generateToken(user);
  result = { accessToken };
  res.json(wrapResult(result));
});
export default app;

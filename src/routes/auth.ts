import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide your Fullname' });
    }

    // check if email exists
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({ message: 'Email is already in used.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    res.status(200).json({
      message: 'User successfully registered'
    })
  } catch (error) {
    console.error('Error in register user: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const jwtSecret = process.env.JWT_SECRET || '';

    // check if user is registered
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token, user });

  } catch (error) {
    console.error('Error in user login: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

export default router;
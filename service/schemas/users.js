import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const user = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [40, 'Name can be up to 40 characters long'],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: [1, 'Password must be at least 1 characters long'],
    // maxlength: [30, 'Password can be up to 30 characters long'],
  },

  token: {
    type: String,
    default: null,
  },

  // refreshToken: {
  //   type: String,
  //   default: null,
  // },
});

user.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('user', user);

export default User;

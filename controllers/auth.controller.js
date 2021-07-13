const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');

const User = require('../models/user.model.js');
const nodemailer = require('../config/nodemailer.config.js');

exports.signup = async (req, res) => {
  try {
    const firstname = req.body.firstname.replace(/\s+/g, '');
    const lastname = req.body.lastname.replace(/\s+/g, '');
    const username = firstname.charAt(0) + lastname;
    const isEmailOk = validator.isEmail(req.body.email);
    const isPasswordOk = validator.isStrongPassword(req.body.password, {
      minUppercase: 0,
      minSymbols: 0
    });
    if (!isEmailOk || !isPasswordOk) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }

    const hashedPasswd = await bcrypt.hash(req.body.password, 10);
    const token = jwt.sign(
      { email: req.body.email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '10min', algorithm: process.env.TOKEN_ALGO }
    );
    const newUser = new User({
      firstname,
      lastname,
      username,
      email: req.body.email,
      password: hashedPasswd,
      confirmationCode: token
    });

    await newUser.save();
    await nodemailer.sendConfirmationEmail(
      newUser.firstname,
      newUser.email,
      newUser.confirmationCode
    );
    res
      .set('Location', `/api/users/${newUser.id}`)
      .status(201)
      .json({ message: 'Created' });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (user.status != 'active') {
      res.status(403).send({ message: 'Forbidden' });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        userName: user.username,
        userFirstname: user.firstname
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '2h', algorithm: process.env.TOKEN_ALGO }
    );
    res.status(200).send({ token: token });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({
      confirmationCode: req.params.confirmationCode
    });
    if (!user) {
      return res.status(404).redirect(process.env.CLIENT_URL);
    }
    await User.updateOne(
      { confirmationCode: req.params.confirmationCode },
      { status: 'active' }
    );
    res.status(200).redirect(process.env.CLIENT_URL + '/signup/emailok');
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.resendConfirmationCode = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    const newCode = jwt.sign(
      { email: req.body.email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '10min', algorithm: process.env.TOKEN_ALGO }
    );
    await User.updateOne(
      { _id: req.params.id },
      { confirmationCode: newCode, status: 'pending' }
    );
    await nodemailer.sendConfirmationEmail(user.firstname, user.email, newCode);
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.requestResetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // ???
    if (!user) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);
    await nodemailer.sendResetPasswordEmail(user._id, user.email, token);
    const hashedToken = await bcrypt.hash(token, 10);
    await User.updateOne(
      { email: req.body.email },
      {
        status: 'pending',
        recoveryToken: {
          hash: hashedToken,
          timestamp: Date.now() + 600000 // 10 min
        }
      }
    );
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.updateResetPassword = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.body.id });
    if (!user) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    const isTokenValid = await bcrypt.compare(
      req.body.token,
      user.recoveryToken.hash
    );
    const isTimeValid = () => {
      const recoveryDate = user.recoveryToken.timestamp;
      const now = Date.now();
      if (recoveryDate < now) {
        return false;
      }
      return true;
    };
    if (!isTokenValid || !isTimeValid()) {
      res.status(400).json({ message: 'Token KO' });
      return;
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.updateOne(
      { _id: req.body.id },
      {
        status: 'active',
        password: newPassword,
        recoveryToken: {}
      }
    );
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ message: 'Not Found' });
      return;
    }
    const match = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!match) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const newHash = await bcrypt.hash(req.body.newPassword, 10);
    await User.updateOne({ _id: req.params.id }, { password: newHash });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    res.status(500).send('error: ' + error);
  }
};

// TODO logout

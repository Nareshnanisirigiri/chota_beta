const express = require('express');
const { getCustomers } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.get('/', getCustomers);

module.exports = {
    userRouter
};

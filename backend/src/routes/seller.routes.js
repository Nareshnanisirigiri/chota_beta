const express = require('express');
const { getSellers } = require('../controllers/seller.controller');

const sellerRouter = express.Router();

sellerRouter.get('/', getSellers);

module.exports = {
    sellerRouter
};

const express = require('express');
const { getStores, getStoreById, updateStoreStatus } = require('../controllers/store.controller');

const storeRouter = express.Router();

storeRouter.get('/', getStores);
storeRouter.get('/:id', getStoreById);
storeRouter.put('/:id/status', updateStoreStatus);

module.exports = {
    storeRouter
};

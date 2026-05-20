const express = require('express');
const {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getSellerSubscriptions,
    getTransactions
} = require('../controllers/subscription.controller');

const subscriptionRouter = express.Router();

subscriptionRouter.get('/plans', getPlans);
subscriptionRouter.post('/plans', createPlan);
subscriptionRouter.put('/plans/:id', updatePlan);
subscriptionRouter.delete('/plans/:id', deletePlan);
subscriptionRouter.get('/seller-subscriptions', getSellerSubscriptions);
subscriptionRouter.get('/transactions', getTransactions);

module.exports = {
    subscriptionRouter
};

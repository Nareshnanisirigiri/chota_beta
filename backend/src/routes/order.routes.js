const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getOrderItems, updateOrderItem, deleteOrderItem } = require("../controllers/order.controller");

const orderRouter = express.Router();

orderRouter.get("/", getOrderItems);
orderRouter.put("/:id", updateOrderItem);
orderRouter.delete("/:id", deleteOrderItem);

module.exports = {
  orderRouter,
};

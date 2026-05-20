const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const { getOrderItems, updateOrderItem, createOrderItem, deleteOrderItem } = require("../controllers/order.controller");

const orderRouter = express.Router();

orderRouter.get("/", getOrderItems);
orderRouter.post("/create", createOrderItem);
orderRouter.put("/:id", updateOrderItem);
orderRouter.delete("/:id", deleteOrderItem);

module.exports = {
  orderRouter,
};

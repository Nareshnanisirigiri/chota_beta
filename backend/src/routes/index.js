const express = require("express");
const { healthRouter } = require("./health.routes");
const { authRouter } = require("./auth.routes");
const { orderRouter } = require("./order.routes");
const { statsRouter } = require("./stats.routes");

const { categoryRouter } = require("./category.routes");
const { brandRouter } = require("./brand.routes");
const { userRouter } = require("./user.routes");
const { walletRouter } = require("./wallet.routes");
const { sellerRouter } = require("./seller.routes");
const { storeRouter } = require("./store.routes");
const { productRouter } = require("./product.routes");
const { productFaqRouter } = require("./product-faq.routes");

const apiRouter = express.Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/order-items", orderRouter);
apiRouter.use("/stats", statsRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/brands", brandRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/wallet-transactions", walletRouter);
apiRouter.use("/sellers", sellerRouter);
apiRouter.use("/stores", storeRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/product-faqs", productFaqRouter);

module.exports = {
  apiRouter,
};

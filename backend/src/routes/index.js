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
const { taxRouter } = require("./tax.routes");
const { deliveryBoyRouter } = require("./delivery-boy.routes");
const { bannerRouter } = require("./banner.routes");
const { featuredSectionRouter } = require("./featured-section.routes");
const { promoRouter } = require("./promo.routes");
const { faqRouter } = require("./faq.routes");
const { deliveryZoneRouter } = require("./delivery-zone.routes");
const { appNotificationRouter } = require("./app-notification.routes");
const { roleRouter } = require("./role.routes");
const { adminUserRouter } = require("./admin-user.routes");
const { settingRouter } = require("./setting.routes");
const { systemUpdateRouter } = require("./system-update.routes");
const { subscriptionRouter } = require("./subscription.routes");

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
apiRouter.use("/tax", taxRouter);
apiRouter.use("/delivery-boys", deliveryBoyRouter);
apiRouter.use("/banners", bannerRouter);
apiRouter.use("/featured-sections", featuredSectionRouter);
apiRouter.use("/promos", promoRouter);
apiRouter.use("/faqs", faqRouter);
apiRouter.use("/delivery-zones", deliveryZoneRouter);
apiRouter.use("/app-notifications", appNotificationRouter);
apiRouter.use("/roles", roleRouter);
apiRouter.use("/admin-users", adminUserRouter);
apiRouter.use("/settings", settingRouter);
apiRouter.use("/system-updates", systemUpdateRouter);
apiRouter.use("/subscriptions", subscriptionRouter);

module.exports = {
  apiRouter,
};

const express = require("express");

const userRouter = require('./src/modules/auth/auth.routes.js')
const categoryRouter = require('./src/modules/category/category.routes.js')
const SubcategoryRouter = require('./src/modules/subcategory/subCategory.routes.js')
const BrandRouter = require('./src/modules/brand/brand.routes.js')
const CuponRouter = require('./src/modules/Cupon/Cupon.routes.js')
const ProductRouter = require('./src/modules/product/product.routes.js')
const cartRouter = require('./src/modules/cart/cart.routes.js')
const orderRouter = require('./src/modules/order/order.routes.js')
const reviewRouter = require('./src/modules/review/review.routes.js')
const mongoConnection = require('./Database/dbConnection.js');

const cors = require('cors');

const AppRouter = (app) => {
  mongoConnection();

  app.use(express.json()); // Parse request bodies as JSON
  app.use(cors())

  // Webhook Handling
  app.use((req, res, next) => {
    if (req.originalUrl === "/Order/Webhook") {
      return next()
    }
    express.json()(req, res, next)
  })


  // Routes
  app.use(userRouter)
  app.use('/Category', categoryRouter)
  app.use('/Subcategory', SubcategoryRouter)
  app.use('/Brand', BrandRouter)
  app.use('/Cupon', CuponRouter)
  app.use('/Product', ProductRouter)
  app.use('/Cart', cartRouter)
  app.use('/Order', orderRouter)
  app.use('/Review', reviewRouter)

  // 404 route
  app.use('*', (req, res) => {
    res.status(404).json({ 'Msg': 'I Can\'t Found' });
  });
};

module.exports = AppRouter;

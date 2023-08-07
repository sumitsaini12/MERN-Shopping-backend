const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");

const router = express.Router();

router
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .post("/", createProduct)
  .patch("/:id", updateProduct);

exports.router = router;

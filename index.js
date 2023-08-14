const express = require("express");
const server = express();
const mongoose = require("mongoose");
var cors = require("cors");
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
//db connections
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
}

//middleware
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); // to parse req.body
server.use("/products", productsRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", orderRouter.router);

server.listen(3000, () => {
  console.log("server started");
});







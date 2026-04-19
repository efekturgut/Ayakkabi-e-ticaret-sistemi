const express = require("express");
const app = express();

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-commerce backend is running");
});

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

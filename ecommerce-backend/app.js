const express = require("express");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");
const siparisRoutes = require("./routes/siparisroutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-commerce backend is running");
});

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", siparisRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
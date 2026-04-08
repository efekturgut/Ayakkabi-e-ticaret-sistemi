const express = require("express");
const app = express();

const productRoutes = require("./routes/productRoutes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-commerce backend is running");
});

app.use("/products", productRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
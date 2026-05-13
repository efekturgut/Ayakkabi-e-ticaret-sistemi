import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div>
      <h2>{product?.name || "Product Name"}</h2>
      <p>{product?.description || "Product description goes here."}</p>
    </div>
  );
};

export default ProductCard;

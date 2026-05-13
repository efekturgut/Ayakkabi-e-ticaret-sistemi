const axios = require("axios");
const kicksdbRepository = require("../repositories/kicksdbRepository");

const kicksdbClient = axios.create({
  baseURL: process.env.KICKSDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.KICKSDB_API_KEY}`,
    Accept: "application/json",
  },
});

const searchSneakers = async (query = "nike") => {
  try {
    const response = await kicksdbClient.get("/v3/stockx/products", {
      params: {
        query,
      },
    });

    return response.data;
  } catch (error) {
    console.error("KicksDB status:", error.response?.status);
    console.error("KicksDB data:", error.response?.data);
    throw error;
  }
};

const extractProductsArray = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data.products)) return data.products;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.items)) return data.items;

  return [];
};

const importSneakers = async (query = "nike") => {
  const data = await searchSneakers(query);
  const products = extractProductsArray(data);

  const importedProducts = [];

  for (const product of products) {
    const importedProduct =
      await kicksdbRepository.createProductFromKicksDB(product);

    importedProducts.push(importedProduct);
  }

  return {
    query,
    totalFromApi: products.length,
    importedCount: importedProducts.length,
    importedProducts,
  };
};

module.exports = {
  searchSneakers,
  importSneakers,
};
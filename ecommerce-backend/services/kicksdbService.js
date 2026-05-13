const axios = require("axios");

const kicksdbClient = axios.create({
  baseURL: process.env.KICKSDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.KICKSDB_API_KEY}`,
    Accept: "application/json",
  },
});

const searchSneakers = async (query = "nike") => {
  try {
    console.log("KicksDB base url:", process.env.KICKSDB_BASE_URL);
    console.log("KicksDB key:", process.env.KICKSDB_API_KEY ? "VAR" : "YOK");

    const response = await kicksdbClient.get("/v3/stockx/products", {
      params: {
        query,
      },
    });

    return response.data;
  } catch (error) {
    console.error("KicksDB status:", error.response?.status);
    console.error("KicksDB data:", error.response?.data);
    console.error("KicksDB key type:", error.response?.headers?.["x-key-type"]);
    console.error("KicksDB quota:", error.response?.headers?.["x-quota-current"]);

    throw error;
  }
};

module.exports = {
  searchSneakers,
};
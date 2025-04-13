const mongoose = require('mongoose');
require('dotenv').config();

/**
 * PURPOSE: Perform a Mongoose query on a specified model
 * @param {string} modelName - Name of the Mongoose model (e.g., 'Message', 'User')
 * @param {object} query - MongoDB query object (e.g., { sender: userId })
 * @param {object} options - Optional query options (e.g., { sort: { sendTime: 1 } })
 * @returns {Promise} Resolves with query results or rejects with an error
 */
async function query(modelName, queryObj = {}, options = {}) {
  try {
    const model = mongoose.model(modelName);
    const results = await model.find(queryObj, null, options).exec();
    return results;
  } catch (err) {
    console.error(`Error querying ${modelName}:`, err.message);
    throw err;
  }
}

/**
 * PURPOSE: Execute a raw MongoDB query (for advanced use cases)
 * @param {string} modelName - Name of the Mongoose model
 * @param {function} queryFn - Function to execute a custom Mongoose query
 * @returns {Promise} Resolves with query results or rejects with an error
 */
async function executeQuery(modelName, queryFn) {
  try {
    const model = mongoose.model(modelName);
    const results = await queryFn(model);
    console.log('ExecuteQuery results:', results);
    return results;
  } catch (err) {
    console.error(`Error in executeQuery for ${modelName}:`, err.message);
    throw err;
  }
}

module.exports = { query, executeQuery };
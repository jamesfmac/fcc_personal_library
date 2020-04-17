const { NODE_ENV } = require("../../config");
const config = require("../../../knexfile")[NODE_ENV];



module.exports = require("knex")(config);

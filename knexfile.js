require("dotenv").config();
const { DATABASE_URL } = require("./src/config");

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/src/config/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/config/db/seeds/development",
    },
  },
  test: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "srx/config/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/config/db/seeds/production",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "srx/config/db/migrations",
    },
    seeds: {
      directory: __dirname + "/src/config/db/seeds/production",
    },
  },

  onUpdateTrigger: (table) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();
`,
};

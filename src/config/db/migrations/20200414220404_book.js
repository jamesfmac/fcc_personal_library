const { onUpdateTrigger } = require("../../../../knexfile");

exports.up = (knex) =>
  knex.schema
    .createTable("book", (t) => {
      t.increments("id").primary();
      t.string("title").notNull();
      t.string("author");
      t.timestamps(false, true);
    })
    .then(() => knex.raw(onUpdateTrigger("book")));

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("book");
};

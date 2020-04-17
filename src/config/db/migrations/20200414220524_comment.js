const { onUpdateTrigger } = require("../../../../knexfile");

exports.up = (knex) =>
  knex.schema
    .createTable("comment", (t) => {
      t.increments("id").primary();
      t.integer("book_id").unsigned().notNull();
      t.foreign("book_id").references("book.id").onDelete("CASCADE");
      t.text("message").notNull();
      t.string("created_by");
      t.timestamps(false, true);
    })
    .then(() => knex.raw(onUpdateTrigger("comment")));

exports.down = (knex) => knex.schema.dropTable("comment");

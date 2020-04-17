const knex = require("../config/db/knex");

exports.create = async (data) => {
  try {
    const result = await knex("book").insert(data, ["id", "title", "author"]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.destroy = async (bookID) => {
  try {
    const result = knex("book").where("id", bookID).del();
    return result;
  } catch (error) {
    throw errror;
  }
};

exports.findOne = async (bookID) => {
  try {
    const result = await knex("book")
      .joinRaw(
        "left join( select book_id, json_build_object('comment_id',id,'message', comment.message, 'author',created_by) as comments from comment ) as comment on comment.book_id = book.id"
      )
      .select([
        "book.id as id",
        "book.title as title",
        "book.author as author",
        knex.raw("ARRAY_AGG(comment.comments) as comments"),
      ])
      .groupBy("book.id", "book.title", "book.author")
      .where("book.id", bookID)
      .first();
    return result;
  } catch (error) {
    throw error;
  }
};

exports.findAll = async (query) => {
  try {
    const result = await knex
      .select("book.id", "book.title", "book.author")
      .count("comment.message", { as: "comment_count" })
      .from("book")
      .leftJoin("comment", "comment.book_id", "book.id")
      .groupBy("book.id", "book.title", "book.author");

    return result;
  } catch (error) {
    throw error;
  }
};

exports.destroyAll = async () => {
  try {
    const result = knex("book").del();
    return result;
  } catch (error) {
    throw errror;
  }
};

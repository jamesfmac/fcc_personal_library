const knex = require("../config/db/knex");

exports.create = async (data) => {
  try {
    const { book_id } = data;

    const createComment = await knex("comment").insert({ ...data });

    if (createComment.rowCount > 0) {
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
        .where("book.id", book_id)
        .first();
      return result;
    }

    return "error";
  } catch (error) {
    throw error;
  }
};

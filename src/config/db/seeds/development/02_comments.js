const comments = [
  {
    book_title: "Atomic Habbits",
    message: "Great read. No words wasted.",
    created_by: "James M",
  },
  {
    book_title: "Atomic Habbits",
    message: "Meh. Interesting book by heard it all before.",
    created_by: "Sarah G",
  },
  {
    book_title: "Zero To One",
    message: "A good way to challenge your thinking.",
    created_by: "Miguel P",
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("comment")
    .del()
    .then(async () => {
      // Inserts seed entries
      const mapBookNameToBookID = async (comment) => {
        const book = await knex("book")
          .where("title", comment.book_title)
          .first();
        return {
          book_id: book.id,
          message: comment.message,
          created_by: comment.created_by,
        };
      };

      const getComments = async () => {
        return Promise.all(
          comments.map((comment) => mapBookNameToBookID(comment))
        );
      };

      const result = await getComments();

      return knex("comment").insert(result);
    });
};

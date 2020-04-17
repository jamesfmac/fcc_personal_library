const { Router } = require("express");
const { validate } = require("../utils/validator");
const booksController = require("../controllers/booksController");

module.exports = () => {
  let api = Router();

  api.route("/").get(function (req, res) {
    res.sendFile(process.cwd() + "/src/views/index.html");
  });

  api
    .route("/books")
    .get(
      booksController.validationRules("listBooks"),
      validate,
      booksController.listBooks
    )
    .post(
      booksController.validationRules("createBook"),
      validate,
      booksController.createBook
    )
    .delete(booksController.deleteAllBooks);

  api
    .route("/books/:id")
    .delete(
      booksController.validationRules("deleteBook"),
      validate,
      booksController.deleteBook
    )
    .get(booksController.getBook);

  api
    .route("/books/:id/comments")
    .post(
      booksController.validationRules("addComment"),
      validate,
      booksController.addComment
    );

  

  return api;
};

const { Router } = require("express");
const book = require("../models/book");

const books = [
  { title: "good bood", author: "writer", commentcount: 3 },
  { title: "bad book", author: "not a writer", commentcount: 2 },
];

module.exports = () => {
  let api = Router();
  api.route("/").get(async (req, res) => {
    const books = await book.findAll();
    res.render("index", { books: books });
  });
  return api;
};

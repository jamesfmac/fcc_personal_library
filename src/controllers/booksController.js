const book = require("../models/book");
const comment = require("../models/comment");

const { body, param, query, oneOf } = require("express-validator");

exports.validationRules = (method) => {
  switch (method) {
    case "createBook":
      {
        return [
          body("title").isString().escape().withMessage("Title is required "),
          body("author").isString().escape().withMessage("Author is required "),
        ];
      }
      break;
    case "deleteBook":
      {
        return [
          param("id").isInt().exists().withMessage("Book ID must be provided"),
        ];
      }
      break;
    case "deleteAllBooks":
      {
        return [body().isEmpty()];
      }
      break;
    case "listBooks":
      {
        return [
          param("title").optional().isString().escape(),
          param("author").optional().isString().escape(),
        ];
      }
      break;
    case "getBook":
      {
        return [
          param("id").isInt().exists().withMessage("Book ID must be provided"),
        ];
      }
      break;
    case "addComment":
      {
        return [
          param("id").isInt().exists().withMessage("Book ID must be provided"),
          param("id").custom(async (value) => {
            const bookCheck = await book.findOne(value);
            if (!bookCheck) {
              return Promise.reject(`Book does not exist with id ${value}`);
            }
            return Promise.resolve();
          }),
          body("message")
            .isString()
            .isLength({ min: 3 })
            .withMessage("Must be a string of min length 3")
            .escape(),
          body("message").optional().isString().escape(),
        ];
      }
      break;
  }
};

exports.listBooks = async (req, res, next) => {
  try {
    const query = req.query;

    const result = await book.findAll(query);

    res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await book.findOne(id);

    if (result) {
      return res.json(result);
    }
    res.status(404).send("Book not found");
  } catch (error) {
    return next(error);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const { title, author } = req.body;
    const result = await book.create({ title: title, author: author });
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await book.destroy(id);

    if (result == 1) {
      return res.json("Delete successful");
    }
    res.json("Book not found");
  } catch (error) {
    return next(error);
  }
};

exports.deleteAllBooks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await book.destroyAll();

    if (result >= 1) {
      return res.json(`Complete delete successful. ${result} books deleted.`);
    }
    res.json("No books to delete");
  } catch (error) {
    return next(error);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const bookID = req.params.id;
    const { message, name } = req.body;

    const result = await comment.create({
      book_id: bookID,
      message: message,
      created_by: name,
    });

    res.json(result);
  } catch (error) {
    console.log("err hit");
    return next(error);
  }
};

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../index");

const book = require("../models/book");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suiteSetup("Clean DB", () => {
      book.destroyAll();
    });
    suite(
      "POST /api/books with title => create book object/expect book object",
      () => {
        test("Test POST /api/books with title", (done) => {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "My test book",
              author: "Test Runner",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.hasAllKeys(res.body, ["id", "author", "title"]);
              assert.isNumber(res.body["id"]);
              assert.equal(res.body["title"], "My test book");
              assert.equal(res.body["author"], "Test Runner");
              done();
            });
        });

        test("Test POST /api/books with no title given", (done) => {
          chai
            .request(server)
            .post("/api/books")
            .send({
              author: "Dr Zeus",
            })
            .end((err, res) => {
              assert.equal(res.status, 422);
              assert.isArray(res.body.errors);
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", () => {
      suiteSetup("clean DB and insert books", () => {
        book.destroyAll();
        book.create([
          { title: "Test one", author: "Dr Zeus" },
          { title: "Test two", author: "james" },
        ]);
      });
      test("Test GET /api/books", (done) => {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.lengthOf(res.body, 2, "Response body has a length of 3");
            assert.hasAllKeys(res.body[0], [
              "title",
              "author",
              "id",
              "commentcount",
            ]);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", () => {
      let validBookID = "";

      suiteSetup("clear DB and add one book", async () => {
        book.destroyAll();
        const createdBook = await book.create({
          title: "test title",
          author: "test author",
        });
        validBookID = createdBook[0].id;
      });

      test("Test GET /api/books/[id] with id not in db", (done) => {
        chai
          .request(server)
          .get("/api/books/99999999")
          .send({
            author: "Dr Zeus",
          })
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", (done) => {
        chai
          .request(server)
          .get(`/api/books/${validBookID}`)
          .send({
            author: "Dr Zeus",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.hasAllKeys(res.body, ["id", "author", "title", "comments"]);
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      () => {
        let validBookID = "";

        suiteSetup("clear DB and add one book", async () => {
          book.destroyAll();
          const createdBook = await book.create({
            title: "test title",
            author: "test author",
          });
          validBookID = createdBook[0].id;
        });
        test("Test POST /api/books/[id] with comment", (done) => {
          chai
            .request(server)
            .post(`/api/books/${validBookID}/comments`)
            .send({
              message: "I like this book",
              name: "Biggest fan",
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.hasAllKeys(res.body, [
                "id",
                "author",
                "title",
                "comments",
              ]);
              assert.lengthOf(
                res.body.comments,
                1,
                "Comments should be an an array of length 1"
              );
              done();
            });
        });
      }
    );
  });
});

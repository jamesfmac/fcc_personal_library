const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../index");

const book = require("../models/book");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "author",
          "Books in array should contain author"
        );
        assert.property(res.body[0], "id", "Books in array should contain id");
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

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
              assert.property(res.body[0], "id");
              assert.property(res.body[0], "title");
              assert.property(res.body[0], "author");
              assert.isNumber(res.body[0]["id"]);
              assert.equal(res.body[0]["title"], "My test book");
              assert.equal(res.body[0]["author"], "Test Runner");
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
              assert.equal(res.status, 500);

              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        done();
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          done();
        });
      }
    );
  });
});

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("./src/index");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  let created_issues = [];
  let created_projects = [];

  suite("Post /api/projects => object with project data", () => {
    test("Project name supplied", (done) => {
      chai
        .request(server)
        .post("/api/projects")
        .send({
          project_name: "test",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], "name");
          assert.property(res.body[0], "created_at");
          assert.property(res.body[0], "updated_at");
          created_projects.push(res.body[0]);
          done();
        });
    });

    test("Project name empty", (done) => {
      chai
        .request(server)
        .post("/api/projects")
        .send({
          project_name: "",
        })
        .end((err, res) => {
          assert.equal(res.status, 422);
          done();
        });
    });
  });

  suite("POST /api/issues/{project} => object with issue data", function () {
    test("Every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "created_at");
          assert.property(res.body[0], "created_by");

          created_issues.push(res.body[0]);
          done();
        });
    });

    test("Required fields filled in", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Required fields filled in",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "created_at");
          assert.property(res.body[0], "created_by");
          created_issues.push(res.body[0]);

          done();
        });
    });

    test("Missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
        })
        .end((err, res) => {
          assert.equal(res.status, 422);
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", () => {
    let issue = "";
    let project = "";

    suiteSetup(() => {
      issue = created_issues[0];
      project = created_projects[0];
    });

    test("No body", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project.name}/${issue.id}`)
        .send()
        .end((err, res) => {
          assert.equal(res.status, 422);
          done();
        });
    });

    test("One field to update", (done) => {
      chai
        .request(server)
        .put(`/api/issues/${project.name}/${issue.id}`)
        .send({ id: issue.id, issue_title: "My New title" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });

    test("Multiple fields to update", function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project.name}/${issue.id}`)
        .send({ id: issue.id, issue_title: "My new new title", open: false })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function () {
      test("No filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_at");
            assert.property(res.body[0], "updated_at");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "id");
            done();
          });
      });

      test("One filter", (done) => {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_at");
            assert.property(res.body[0], "updated_at");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "id");
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", (done) => {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: true, status_text: "In QA" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_at");
            assert.property(res.body[0], "updated_at");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "id");
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project}/{issue} => text", () => {
    let issue = "";
    let project = "";

    suiteSetup(() => {
      issue = created_issues.shift();
      project = created_projects[0];
    });

    test("No id", (done) => {
      chai
        .request(server)
        .delete(`/api/issues/${project.name}/`)
        .send()
        .end((err, res) => {
          assert.equal(res.status, 404);

          done();
        });
    });

    test("Valid id", (done) => {
      chai
        .request(server)
        .delete(`/api/issues/${project.name}/${issue.id}`)
        .send()
        .end((err, res) => {
          assert.equal(res.status, 200);

          done();
        });
    });
  });
});

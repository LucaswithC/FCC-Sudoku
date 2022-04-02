const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let testArr = arrPuzzle(testPuzzle)

let invalidPuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let invalidArr = arrPuzzle(invalidPuzzle)

suite("Functional Tests", () => {
  test("Valid Puzzle", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: testPuzzle})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
        done();
      });
  });
  test("Missing Puzzle", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: ""})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  test("Invalid Puzzle", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: '1ß5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Invalid Puzzle Length", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: '1..5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Unsolvable Puzzle", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({puzzle: invalidPuzzle})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test("All Fields Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: '135762984946381257728459613694517832812936745357824196473298561581673429269145378', coordinate: 'A1', value: '1'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isTrue(res.body.valid);
        done();
      });
  });
  test("Single Place Conflict", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: 'A2', value: '9'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "column");
        done();
      });
  });
  test("Multiple Place Conflict", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: 'A2', value: '1'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "region");
        done();
      });
  });
  test("All Place Conflict", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: 'B2', value: '2'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "column");
        assert.equal(res.body.conflict[2], "region");
        done();
      });
  });
  test("Missing Coordinate Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: "", value: '2'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Invalid Characters Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: '1ü.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: "A2", value: '2'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Invalid Lenght Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: '1...5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: "A2", value: '2'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Invalid Coordinate Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: "Z2", value: '2'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  test("Invalid Value Check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({puzzle: testPuzzle, coordinate: "A2", value: '19'})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});


function arrPuzzle(puzzle) {
    let testArr = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        testArr[i].push(parseInt(puzzle[i * 9 + j].replace(".", 0)));
      }
    }
    return testArr;
  }

  function alphaVal(s) {
    return s.toLowerCase().charCodeAt(0) - 97;
  }
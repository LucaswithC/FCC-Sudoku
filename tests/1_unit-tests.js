const chai = require('chai');
const SudokuSolver = require('../controllers/sudoku-solver.js');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

let testPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let testArr = arrPuzzle(testPuzzle)

suite('UnitTests', () => {
    test('#valid String', () => {
        assert.isUndefined(solver.validate(testPuzzle))
    })
    test('#invalid String Nr', () => {
        assert.deepEqual(solver.validate('1ß5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), { error: "Invalid characters in puzzle" })
    })
    test('#invalid String length', () => {
        assert.deepEqual(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..'), { error: "Expected puzzle to be 81 characters long" })
    })
    test('#valid Row', () => {
        assert.isNull(solver.checkRowPlacement(testArr, alphaVal('A'), 3, 7))
    })
    test('#invalid Row', () => {
        assert.equal(solver.checkRowPlacement(testArr, alphaVal('A'), 3, 5), "row")
    })
    test('#valid Col', () => {
        assert.isNull(solver.checkColPlacement(testArr, alphaVal('A'), 3, 7))
    })
    test('#invalid Col', () => {
        assert.equal(solver.checkColPlacement(testArr, alphaVal('A'), 3, 1), "column")
    })
    test('#valid region', () => {
        assert.isNull(solver.checkRegionPlacement(testArr, alphaVal('A'), 3, 7))
    })
    test('#invalid region', () => {
        assert.equal(solver.checkRegionPlacement(testArr, alphaVal('A'), 3, 1), "region")
    })
    test('#valid puzzle', () => {
        assert.isUndefined(solver.validate(testPuzzle))
    })
    test('#invalid Puzzle', () => {
        assert.isFalse(solver.solve(arrPuzzle('115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')))
    })
    test('#valid Solution', () => {
        assert.equal(solver.solve(testArr), '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
    })
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
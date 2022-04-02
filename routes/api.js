"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    // Input Check
    let puzzleInput = req.body.puzzle || ""
    let coordinate = req.body.coordinate || "";
    let value = req.body.value || "";
    
    if (!puzzleInput || !coordinate || !value) return res.json({ error: "Required field(s) missing" });

    let val = solver.validate(puzzleInput);
    if(val?.error) return res.json(val)
    
    let puzzle = arrPuzzle(puzzleInput) || "";
    
    if (coordinate.length > 2 || !/[a-iA-I]/.test(coordinate[0]) || !/[1-9]/.test(coordinate[1])) return res.json({ error: "Invalid coordinate" });
    if (value > 9 || value < 1 || !/[1-9]/.test(value)) return res.json({ error: "Invalid value" });

    let coordX = alphaVal(coordinate[0])
    let coordY = coordinate[1] - 1

    let conflict = [];
    let rowCheck = solver.checkRowPlacement(puzzle, coordX, coordY, parseInt(value));
    if (rowCheck) conflict.push(rowCheck);

    let colCheck = solver.checkColPlacement(puzzle, coordX, coordY, parseInt(value));
    if (colCheck) conflict.push(colCheck);

    let regionCheck = solver.checkRegionPlacement(puzzle, coordX, coordY, parseInt(value));
    if (regionCheck) conflict.push(regionCheck);

    if (conflict.length !== 0) {
      res.json({ valid: false, conflict: conflict });
    } else {
      res.json({ valid: true });
    }
  });

  app.route("/api/solve").post((req, res) => {
    let val = solver.validate(req.body.puzzle || "");
    if(val?.error) return res.json(val)
    let puzzle = arrPuzzle(req.body.puzzle);
    let solution = solver.solve(puzzle)
    if(solution) {
      return res.json({ solution: solution })
    } else {
      return res.json({ error: "Puzzle cannot be solved" });
    }
  });

  function arrPuzzle(puzzle) {
    let puzzleArr = [[], [], [], [], [], [], [], [], []];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzleArr[i].push(parseInt(puzzle[i * 9 + j].replace(".", 0)));
      }
    }
    return puzzleArr;
  }

  function alphaVal(s) {
    return s.toLowerCase().charCodeAt(0) - 97;
  }
};
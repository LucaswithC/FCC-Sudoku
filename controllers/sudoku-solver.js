class SudokuSolver {
  validate(puzzleString, res) {
    if (puzzleString === "") return { error: "Required field missing" };
    let puzzleRegex = /(^(\.+)?(([0-9]+)?(\.+)?)+$)/g;
    if (!puzzleRegex.test(puzzleString)) return  { error: "Invalid characters in puzzle" }
    if (puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };
  }

  checkRowPlacement(puzzle, row, column, value) {
    if (puzzle[row][column] === value) return null;
    for (let i = 0; i < 9; i++) {
      if (puzzle[row][i] === value) return "row";
    }
    return null;
  }

  checkColPlacement(puzzle, row, column, value) {
    if (puzzle[row][column] === value) return null;
    for (let i = 0; i < 9; i++) {
      if (puzzle[i][column] === value) return "column";
    }
    return null;
  }

  checkRegionPlacement(puzzle, row, column, value) {
    if (puzzle[row][column] === value) return null;
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzle[startRow + i][startCol + j] === value) return "region";
      }
    }
    return null;
  }

  solve(puzzle) {
    loopRow: for (let i = 0; i < 9; i++) {
      loopCol: for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] !== 0) continue loopCol;
        loopValue: for (let v = 1; v < 10; v++) {
          let rowCheck = this.checkRowPlacement(puzzle, i, j, v);
          if (rowCheck) continue loopValue;

          let colCheck = this.checkColPlacement(puzzle, i, j, v);
          if (colCheck) continue loopValue;

          let regionCheck = this.checkRegionPlacement(puzzle, i, j, v);
          if (regionCheck) continue loopValue;

          puzzle[i][j] = v;
          if (this.solve(puzzle)) return puzzle.join("").replaceAll(",", "");
        }
        puzzle[i][j] = 0;
        return false;
      }
    }
    return puzzle.join("").replaceAll(",", "");
  }
}

// Thanks to ggorlen for the inspiration

module.exports = SudokuSolver;

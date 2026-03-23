const SudokuEngine = {
    generate(difficulty) {
        const sol = Array.from({length:9}, () => Array(9).fill(0));
        this.solve(sol, true);
        const board = sol.map(row => [...row]);
        const given = Array.from({length:9}, () => Array(9).fill(true));
        const removeCount = { easy: 30, medium: 45, hard: 55 }[difficulty];

        let removed = 0;
        const positions = this.shuffle([...Array(81).keys()]);
        for (const pos of positions) {
            if (removed >= removeCount) break;
            const r = Math.floor(pos / 9), c = pos % 9;
            board[r][c] = 0;
            given[r][c] = false;
            removed++;
        }
        return { board, solution: sol, given };
    },

    solve(board, randomize) {
        const empty = this.findEmpty(board);
        if (!empty) return true;
        const [r, c] = empty;
        let nums = [1,2,3,4,5,6,7,8,9];
        if (randomize) nums = this.shuffle(nums);
        for (const n of nums) {
            if (this.isValid(board, r, c, n)) {
                board[r][c] = n;
                if (this.solve(board, randomize)) return true;
                board[r][c] = 0;
            }
        }
        return false;
    },

    isValid(board, r, c, n) {
        if (board[r].includes(n)) return false;
        if (board.some(row => row[c] === n)) return false;
        const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
        for (let i = br; i < br+3; i++)
            for (let j = bc; j < bc+3; j++)
                if (board[i][j] === n) return false;
        return true;
    },

    findEmpty(board) {
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++)
                if (board[r][c] === 0) return [r, c];
        return null;
    },

    shuffle(arr) {
        for (let i = arr.length-1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};
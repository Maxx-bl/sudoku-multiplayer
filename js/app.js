const ui = {
    state: {
        mode: 'solo',
        difficulty: 'medium',
        board: [],
        solution: [],
        given: [],
        selectedNum: null,   // the digit selected on the numpad (1-9 or null)
        errors: 0,
        timer: 0,
        interval: null,
        history: []          // [{r, c, oldVal}]
    },

    /* ── NAVIGATION ── */
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    goHome() {
        clearInterval(this.state.interval);
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('wipOverlay').classList.remove('show');
        // Close diff panel
        document.getElementById('diffPanel').classList.remove('open');
        this.showScreen('home');
    },

    togglePanel(id) {
        const el = document.getElementById(id);
        el.classList.toggle('open');
    },

    showMultiWip() {
        document.getElementById('wipOverlay').classList.add('show');
    },

    /* ── GAME START ── */
    startGame(mode, diff) {
        const s = this.state;
        s.mode = mode;
        s.difficulty = diff;
        s.errors = 0;
        s.timer = 0;
        s.history = [];
        s.selectedNum = null;

        const data = SudokuEngine.generate(diff);
        s.board    = data.board;
        s.solution = data.solution;
        s.given    = data.given;

        const labels = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };
        document.getElementById('diffBadge').textContent = labels[diff] || diff;
        document.getElementById('timerDisplay').textContent = '00:00';
        document.getElementById('overlay').classList.remove('show');
        document.getElementById('currentErrors').textContent = '0';
        
        this.renderBoard();
        this.renderNumpad();
        this.startTimer();
        this.showScreen('game');
    },

    replay() {
        document.getElementById('overlay').classList.remove('show');
        this.startGame(this.state.mode, this.state.difficulty);
    },

    /* ── TIMER ── */
    startTimer() {
        clearInterval(this.state.interval);
        this.state.interval = setInterval(() => {
            this.state.timer++;
            const m = Math.floor(this.state.timer / 60).toString().padStart(2, '0');
            const s = (this.state.timer % 60).toString().padStart(2, '0');
            document.getElementById('timerDisplay').textContent = `${m}:${s}`;
        }, 1000);
    },

    /* ── RENDER BOARD ── */
    renderBoard() {
        const s = this.state;
        const boardEl = document.getElementById('sudokuBoard');
        boardEl.innerHTML = '';

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                const val = s.board[r][c];
                const isGiven = s.given[r][c];

                cell.className = 'cell';

                if (isGiven) {
                    cell.classList.add('given');
                    cell.textContent = val;
                } else if (val !== 0) {
                    cell.classList.add('user-filled');
                    cell.textContent = val;
                    if (val !== s.solution[r][c]) {
                        cell.classList.add('error');
                    }
                }

                // Highlight cells that contain the selected number
                if (s.selectedNum !== null && val === s.selectedNum) {
                    cell.classList.add('same-num');
                }

                cell.addEventListener('click', () => this.handleCellClick(r, c));
                boardEl.appendChild(cell);
            }
        }
    },

    /* ── RENDER NUMPAD ── */
    renderNumpad() {
        const s = this.state;
        const pad = document.getElementById('numpad');
        pad.innerHTML = '';

        for (let n = 1; n <= 9; n++) {
            const btn = document.createElement('button');
            btn.className = 'num-btn';
            btn.textContent = n;
            btn.dataset.n = n;

            if (s.selectedNum === n) btn.classList.add('active');

            // Count how many times n appears correctly on the board
            let count = 0;
            for (let r = 0; r < 9; r++)
                for (let c = 0; c < 9; c++)
                    if (s.board[r][c] === n && s.solution[r][c] === n) count++;
            if (count >= 9) btn.classList.add('exhausted');

            btn.addEventListener('click', () => this.handleNumClick(n));
            pad.appendChild(btn);
        }
    },

    /* ── INTERACTIONS ── */

    // Click on a numpad digit: select it (or deselect if already selected)
    handleNumClick(n) {
        const s = this.state;
        if (s.selectedNum === n) {
            s.selectedNum = null;
        } else {
            s.selectedNum = n;
        }
        this.renderBoard();
        this.renderNumpad();
    },

    // Click on a cell: if a number is selected, place / remove it
    handleCellClick(r, c) {
        const s = this.state;
        if (s.selectedNum === null) return; // nothing selected, ignore
        if (s.given[r][c]) return;          // can't modify given cells

        const current = s.board[r][c];

        // Toggle: if same user-placed digit, remove it
        if (current === s.selectedNum) {
            s.history.push({ r, c, oldVal: current });
            s.board[r][c] = 0;
        } else {
            // Place the digit
            s.history.push({ r, c, oldVal: current });
            s.board[r][c] = s.selectedNum;
            if (s.selectedNum !== s.solution[r][c]) {
                s.errors++;
                document.getElementById('currentErrors').textContent = s.errors;
            }
        }

        this.renderBoard();
        this.renderNumpad();
        this.checkWin();
    },

    /* ── ERASE selected cell (if any number is active, clear last placed) ── */
    eraseSelected() {
        // Erase: clears the last cell that matches selectedNum, or just undo
        this.undo();
    },

    /* ── UNDO ── */
    undo() {
        const s = this.state;
        if (!s.history.length) return;
        const last = s.history.pop();
        s.board[last.r][last.c] = last.oldVal;
        this.renderBoard();
        this.renderNumpad();
    },

    /* ── WIN CHECK ── */
    checkWin() {
        const s = this.state;
        const win = s.board.every((row, r) => row.every((val, c) => val === s.solution[r][c]));
        if (!win) return;

        clearInterval(s.interval);
        document.getElementById('oTime').textContent = document.getElementById('timerDisplay').textContent;
        document.getElementById('oErrors').textContent = s.errors;
        document.getElementById('overlayTitle').textContent = s.errors === 0 ? 'Parfait !' : 'Terminé';
        document.getElementById('overlay').classList.add('show');
    }
};
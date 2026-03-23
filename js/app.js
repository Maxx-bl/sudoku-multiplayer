const ui = {
    state: {
        mode: 'solo',
        difficulty: 'medium',
        board: [],
        solution: [],
        given: [],
        selected: null,
        noteMode: false,
        errors: 0,
        timer: 0,
        interval: null,
        history: []
    },

    togglePanel(id) {
        const el = document.getElementById(id);
        const isOpen = el.classList.contains('open');
        document.querySelectorAll('.diff-panel, .multi-panel, .room-input-area').forEach(p => p.classList.remove('open'));
        if (!isOpen) el.classList.add('open');
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    goHome() {
        clearInterval(this.state.interval);
        document.getElementById('overlay').classList.remove('show');
        this.showScreen('home');
    },

    createRoom() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('lobbyCode').textContent = code;
        this.showScreen('lobby');
        setTimeout(() => {
            document.getElementById('slot2').classList.replace('waiting', 'filled');
            document.getElementById('slot2').innerHTML = "Adversaire Prêt";
        }, 2000);
    },

    joinRoom() {
        this.startGame('multi', 'medium');
    },

    startGame(mode, diff) {
        this.state.mode = mode;
        this.state.difficulty = diff;
        this.state.errors = 0;
        this.state.timer = 0;
        this.state.history = [];
        
        const data = SudokuEngine.generate(diff);
        this.state.board = data.board;
        this.state.solution = data.solution;
        this.state.given = data.given;

        document.getElementById('mpBar').style.display = mode === 'multi' ? 'flex' : 'none';
        document.getElementById('diffBadge').textContent = diff.toUpperCase();
        
        this.renderBoard();
        this.renderNumpad();
        this.startTimer();
        this.showScreen('game');
        document.getElementById('overlay').classList.remove('show');
    },

    startTimer() {
        clearInterval(this.state.interval);
        this.state.interval = setInterval(() => {
            this.state.timer++;
            const m = Math.floor(this.state.timer / 60).toString().padStart(2, '0');
            const s = (this.state.timer % 60).toString().padStart(2, '0');
            document.getElementById('timerDisplay').textContent = `${m}:${s}`;
        }, 1000);
    },

    renderBoard() {
        const boardEl = document.getElementById('sudokuBoard');
        boardEl.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = `cell ${this.state.given[r][c] ? 'given' : ''}`;
                if (this.state.selected?.r === r && this.state.selected?.c === c) cell.classList.add('selected');
                
                const val = this.state.board[r][c];
                if (val !== 0) {
                    cell.textContent = val;
                    if (!this.state.given[r][c] && val !== this.state.solution[r][c]) cell.classList.add('error');
                }
                cell.onclick = () => { this.state.selected = {r, c}; this.renderBoard(); };
                boardEl.appendChild(cell);
            }
        }
    },

    renderNumpad() {
        const pad = document.getElementById('numpad');
        pad.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.className = 'num-btn';
            btn.textContent = i;
            btn.onclick = () => this.fillCell(i);
            pad.appendChild(btn);
        }
    },

    fillCell(n) {
        if (!this.state.selected || this.state.given[this.state.selected.r][this.state.selected.c]) return;
        const {r, c} = this.state.selected;
        this.state.board[r][c] = n;
        if (n !== 0 && n !== this.state.solution[r][c]) this.state.errors++;
        this.renderBoard();
        this.checkWin();
    },

    toggleNotes() {
        this.state.noteMode = !this.state.noteMode;
        document.getElementById('noteBtn').classList.toggle('active');
    },

    giveHint() {
        for(let r=0; r<9; r++) {
            for(let c=0; c<9; c++) {
                if(this.state.board[r][c] === 0) {
                    this.state.board[r][c] = this.state.solution[r][c];
                    this.renderBoard();
                    return;
                }
            }
        }
    },

    undo() {
        alert("Fonction bientôt disponible !");
    },

    checkWin() {
        const win = this.state.board.every((row, r) => row.every((val, c) => val === this.state.solution[r][c]));
        if (win) {
            clearInterval(this.state.interval);
            document.getElementById('oTime').textContent = document.getElementById('timerDisplay').textContent;
            document.getElementById('oErrors').textContent = this.state.errors;
            document.getElementById('overlay').classList.add('show');
        }
    }
};
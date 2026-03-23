const ui = {
    state: {
        mode: 'solo',
        difficulty: 'medium',
        board: [],
        solution: [],
        given: [],
        notes: [],
        selected: null,
        noteMode: false,
        errors: 0,
        timer: 0,
        interval: null
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Navigation & Menu
        document.getElementById('btnSolo').onclick = () => this.togglePanel('diffPanel');
        document.getElementById('btnMulti').onclick = () => this.togglePanel('multiPanel');
        
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.onclick = () => this.startGame('solo', btn.dataset.diff);
        });

        document.getElementById('btnCreateRoom').onclick = () => {
            document.getElementById('lobbyCode').textContent = Math.random().toString(36).substring(2, 8).toUpperCase();
            this.showScreen('lobby');
        };

        // Game Controls
        document.getElementById('noteBtn').onclick = () => {
            this.state.noteMode = !this.state.noteMode;
            document.getElementById('noteBtn').classList.toggle('active');
        };

        document.getElementById('btnUndo').onclick = () => this.undo();
        document.getElementById('btnErase').onclick = () => this.fillCell(0);
        document.getElementById('btnHint').onclick = () => this.giveHint();
        document.getElementById('overlayReplayBtn').onclick = () => this.startGame(this.state.mode, this.state.difficulty);
    },

    togglePanel(id) {
        const p = document.getElementById(id);
        const isOpen = p.classList.contains('open');
        document.querySelectorAll('.diff-panel, .multi-panel').forEach(el => el.classList.remove('open'));
        if (!isOpen) p.classList.add('open');
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    goHome() {
        clearInterval(this.state.interval);
        this.showScreen('home');
    },

    startGame(mode, diff) {
        this.state.mode = mode;
        this.state.difficulty = diff;
        this.state.errors = 0;
        this.state.timer = 0;
        
        const data = SudokuEngine.generate(diff);
        this.state.board = data.board;
        this.state.solution = data.solution;
        this.state.given = data.given;
        this.state.notes = Array.from({length:9}, () => Array.from({length:9}, () => new Set()));

        this.renderBoard();
        this.renderNumpad();
        this.startTimer();
        this.showScreen('game');
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
        const container = document.getElementById('sudokuBoard');
        container.innerHTML = '';
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
                container.appendChild(cell);
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
        
        if (this.state.noteMode && n !== 0) {
            // Logique de notes simplifiée pour cet exemple
            return;
        }

        this.state.board[r][c] = n;
        if (n !== 0 && n !== this.state.solution[r][c]) this.state.errors++;
        
        this.renderBoard();
        this.checkWin();
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

// Lancement
ui.init();
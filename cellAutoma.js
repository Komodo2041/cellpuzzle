class Automa {

    constructor(size, pattern, colors) {
        this.changeSize(size);
        this.changePattern(pattern)
        this.changeColors(colors);
        this.map = this.getzeroshema();
        this.allStep = 20;
    }

    changeSize(size) {

        switch (parseInt(size)) {
            case 1:
                this.size = 100;
                this.cellsize = 6;
                break;
            case 2:
                this.size = 150;
                this.cellsize = 4;
                break;
            case 3:
                this.size = 200;
                this.cellsize = 3;
                break;
        }
        this.map = this.getzeroshema();
    }

    changePattern(pattern) {
        if (pattern == 2) {
            this.strategy = new labirynt();
        }
        if (pattern == 1) {
            this.strategy = new wolfram();
        }
    }

    changeColors(level) {
        this.levelColors = level;
    }

    getzeroshema() {
        let res = new Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            res[i] = new Array(this.size).fill(0);
        }
        return res;
    }

    getzerosmallTable(size) {
        let res = new Array(size).fill(0);
        for (let i = 0; i < size; i++) {
            res[i] = new Array(size).fill(0);
        }
        return res;
    }

    checkskala(r = 20) {
        const n = Math.floor(Math.random() * 100);
        const res = (n >= r) ? 1 : 0;
        return res;
    }

    drawGeneration0() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.map[i][j] = this.checkskala();
            }
        }
    }

    changePlace(pos) {
        let size = 120 / this.cellsize;
        for (let i = pos[0]; i < pos[0] + size; i++) {
            for (let j = pos[1]; j < pos[1] + size; j++) {
                this.map[i][j] = this.checkskala(60);
            }
        }
        for (let i = 0; i <= this.allStep; i++) {
            this.calcNextstepInFragment(pos, size);
        }
        if (this.levelColors != 1) {
            this.useLevel(size, pos[0], pos[1]);
        }
    }

    createMap() {
        this.drawGeneration0();
        for (let i = 0; i <= this.allStep; i++) {

            this.calcNextstep();
        }
        if (this.levelColors != 1) {
            this.useLevel(this.size);
        }

    }

    useLevel(size, x = 0, y = 0) {

        for (let i = x; i < size + x; i++) {
            for (let j = y; j < size + y; j++) {
                if (this.map[i][j] == 1) {
                    if (this.levelColors == 2) {

                        this.map[i][j] = getMaxRandom(1) + 1;

                    }
                    if (this.levelColors == 3) {
                        this.map[i][j] = getMaxRandom(2) + 1;
                    }
                }
            }
        }
    }

    calcNextstep() {

        let newMap = this.getzeroshema();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let nr = this.calcNeighbor(i, j);
                newMap[i][j] = this.setStanCell(this.map[i][j], nr);
            }
        }
        this.map = newMap.slice();

    }

    calcNextstepInFragment(pos, size) {
        let newMap = this.getzerosmallTable(size);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let nr = this.calcNeighbor(pos[0] + i, pos[1] + j);
                newMap[i][j] = this.setStanCell(this.map[pos[0] + i][pos[1] + j], nr);
            }
        }
        for (let i = pos[0]; i < pos[0] + size; i++) {
            for (let j = pos[1]; j < pos[1] + size; j++) {
                this.map[i][j] = newMap[i - pos[0]][j - pos[1]];
            }
        }


    }

    calcNeighbor(x, y) {
        let res = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (this.map[this.invinity(x + i)][this.invinity(y + j)] > 0) {
                    res++;
                }
            }
        }
        if (this.map[x][y] > 0) {
            res--;
        }
        return res;
    }

    invinity(nr) {
        if (nr >= this.size) {
            nr -= this.size;
        }
        if (nr < 0) {
            nr += this.size;
        }
        return nr;
    }

    getMap() {
        return this.map;
    }

    getParams() {
        return [this.size, this.cellsize];
    }

    setStanCell(cell, nr) {
        return this.strategy.checkCell(cell, nr);
    }

};


class labirynt {
    checkCell(stan, nrneigbours) {
        let res = 0;
        if (stan == 1 && (nrneigbours >= 1 && nrneigbours <= 5)) {
            res = 1;
        }
        if (stan == 0 && (nrneigbours == 3)) {
            res = 1;
        }
        return res;
    }
}

class wolfram {
    checkCell(stan, nrneigbours) {
        let res = 0;
        if (nrneigbours == 1 || nrneigbours == 0 || nrneigbours == 8) {
            res = 1;
        }
        return res;
    }
}

class gemeoflife {
    checkCell(stan, nrneigbours) {
        let res = 0;
        if (stan == 0 && (nrneigbours == 3)) {
            res = 1;
        }
        if (stan == 1 && (nrneigbours == 3 || nrneigbours == 2)) {
            res = 1;
        }
    }
}

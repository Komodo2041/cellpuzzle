
function getMaxRandom(max) {
    var n = Math.floor(Math.random() * (max + 1));
    return n;
}

function fillBigCanva(table, param) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'white';

    for (var i = 0; i < param[0]; i++) {
        for (var j = 0; j < param[0]; j++) {
            if (table[i][j]) {
                ctx.fillStyle = data.colors[table[i][j]];
                ctx.fillRect(i * param[1], j * param[1], param[1], param[1]);
            } else {
                ctx.fillStyle = data.colors[table[i][j]];
                ctx.fillRect(i * param[1], j * param[1], param[1], param[1]);
            }

        }
    }
}

function clearRect() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'silver';
    ctx.clearRect(0, 0, 600, 600);
}


function getPosPuzzles(nrpuzzles, params) {
    let smSize = 120 / params[1];
    let len = params[0] - smSize;
    let table = [];
    for (i = 0; i < nrpuzzles; i++) {
        let x = getMaxRandom(len);
        let y = getMaxRandom(len);
        if (checkPosiSGood(x, y, table, smSize)) {
            table.push([x, y]);
        } else {
            i--;
        }
    }
    return table;
}

function checkPosiSGood(x, y, table, nr = -1, smSize = 20) {
    var res = 1;
    for (j = 0; j < table.length; j++) {
        if (nr == j) {
            continue;
        }
        if (Math.abs(table[j][0] - x) <= smSize && Math.abs(table[j][1] - y) <= smSize) {
            res = 0;
            break;
        }
    }
    return res;
}

function fillSmallCanva(table, pos, params) {

    for (i = 1; i <= pos.length; i++) {
        var c = document.getElementById("puzzle" + i);
        var ctx = c.getContext("2d");
        ctx.fillStyle = 'white';
        fillPuzzle(table, pos[i - 1], ctx, params);
    }
}

function fillPuzzle(table, pos, ctx, param) {
    let smSize = 120 / param[1];
    for (var i = 0; i < smSize; i++) {
        for (var j = 0; j < smSize; j++) {
            if (table[pos[0] + i][pos[1] + j] > 0) {
                ctx.fillStyle = data.colors[table[pos[0] + i][pos[1] + j]];
                ctx.fillRect(i * param[1], j * param[1], param[1], param[1]);
            } else {
                ctx.fillStyle = data.colors[table[pos[0] + i][pos[1] + j]];
                ctx.fillRect(i * param[1], j * param[1], param[1], param[1]);
            }

        }
    }
}

function seeSolution(pos, param) {
    var nr = pos.length;
    let smSize = 120 / param[1];
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "orange";
    ctx.lineJoin = "bevel";
    for (i = 1; i <= nr; i++) {
        ctx.strokeRect(pos[i - 1][0] * param[1], pos[i - 1][1] * param[1], smSize * param[1], smSize * param[1]);
    }
}

function checkposFit(pos, mousepos, param) {

    var diffX = Math.abs(pos[0] * param[1] - mousepos[0]);
    var diffY = Math.abs(pos[1] * param[1] - mousepos[1]);
    if (diffX < 10 && diffY < 10) {
        return 1;
    }
    return 0;
}



function changePlaceInBigCanva(pos, table, density) {
    var newTable = table;
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            newTable[pos[0] + i][pos[1] + j] = 3;

            var r = checkskala(density);
            if (r) {
                newTable[pos[0] + i][pos[1] + j] = getMaxRandom(23);
            } else {
                newTable[pos[0] + i][pos[1] + j] = 0;
            }
        }
    }

    return newTable;
}

function setNewPosPuzzle(puzzlePos, nr, params) {
    let smSize = 120 / params[1];
    let len = params[0] - smSize;

    var pos = [];
    for (i = 0; i < 1; i++) {
        var x = getMaxRandom(len);
        var y = getMaxRandom(len);
        if (checkPosiSGood(x, y, puzzlePos, nr, smSize)) {
            pos = [x, y];
        } else {
            i--;
        }
    }

    return pos;
}

function changeSmallPuzzle(pos, table, id, param) {
    var c = document.getElementById("puzzle" + id);
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'white';
    fillPuzzle(table, pos, ctx, param);
}



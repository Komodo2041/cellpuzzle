

function getzeroshema() {
    var res = new Array(30).fill(0);
    for (let i = 0; i < 30; i++) {
        res[i] = new Array(30).fill(0);
    }
    return res;
}

function checkskala(r) {
    var n = Math.floor(Math.random() * 100);
    if (n >= (100 - r)) {
        return 1;
    } else {
        return 0;
    }
}

function getMaxRandom(max) {
    var n = Math.floor(Math.random() * (max + 1));
    return n;
}

function createRandomMap(table, density) {
    for (var i = 0; i < 30; i++) {
        for (var j = 0; j < 30; j++) {

            var r = checkskala(density);
            if (r) {
                table[i][j] = getMaxRandom(23);
            } else {
                table[i][j] = 0;
            }
        }
    }

    return table;

}

function fillBigCanva(table, type = 1) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'white';

    for (var i = 0; i < 30; i++) {
        for (var j = 0; j < 30; j++) {
            fillImage(ctx, table[i][j], i, j, type);

        }
    }
}

function clearRect() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'silver';
    ctx.clearRect(0, 0, 900, 900);
}

function fillImage(ctx, value, i, j, type) {
    if (value > 0) {
        var imgpath = getImg(type, value);
        if (imgpath) {
            var obrazek = new Image();
            obrazek.src = imgpath;
            ctx.drawImage(obrazek, 30 * i, 30 * j, 30, 30);
        }
    } else {
        ctx.fillRect(30 * i, 30 * j, 30, 30);
    }
}

function getPosPuzzles(nrpuzzles) {
    var len = 30 - 6;
    var table = [];
    for (i = 0; i < nrpuzzles; i++) {
        var x = getMaxRandom(len);
        var y = getMaxRandom(len);
        if (checkPosiSGood(x, y, table)) {
            table.push([x, y]);
        } else {
            i--;
        }
    }
    return table;
}

function checkPosiSGood(x, y, table, nr = -1) {
    var res = 1;
    for (j = 0; j < table.length; j++) {
        if (nr == j) {
            continue;
        }
        if (Math.abs(table[j][0] - x) <= 6 && Math.abs(table[j][1] - y) <= 6) {
            res = 0;
            break;
        }
    }
    return res;
}

function fillSmallCanva(table, pos, type = 1) {
    var nr = pos.length;
    for (i = 1; i <= nr; i++) {
        var c = document.getElementById("puzzle" + i);
        var ctx = c.getContext("2d");
        ctx.fillStyle = 'white';
        fillPuzzle(table, pos[i - 1], type, ctx);
    }
}

function fillPuzzle(table, pos, type, ctx) {
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            fillImage(ctx, table[pos[0] + i][pos[1] + j], i, j, type);
        }
    }
}

function seeSolution(pos) {
    var nr = pos.length;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.lineWidth = 4;
    ctx.strokeStyle = "navy";
    ctx.lineJoin = "bevel";
    for (i = 1; i <= nr; i++) {
        ctx.strokeRect(pos[i - 1][0] * 30, pos[i - 1][1] * 30, 6 * 30, 6 * 30);
    }
}

function getImg(type, nr) {

    path = "grafika/";
    switch (type) {
        case 1:
            path += nr;
            break;
        case 2:
            path += "a" + nr;
            break;
        case 3:
            path += "e" + nr;
            break;
    }
    path += "_mini.jpg";
    return path;
}

function setGraphics(type) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    for (var i = 1; i <= 23; i++) {
        var imgpath = getImg(type, i);
        if (imgpath) {
            var obrazek = new Image();
            obrazek.src = imgpath;
            ctx.drawImage(obrazek, 0, 0, 30, 30);
        }
    }
}

function checkposFit(pos, mousepos) {

    var diffX = Math.abs(pos[0] * 30 - mousepos[0]);
    var diffY = Math.abs(pos[1] * 30 - mousepos[1]);

    if (diffX < 10 && diffY < 10) {
        return 1;
    }
    return 0;
}

function addPoints(pos, table) {
    var res = 0;
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            if (table[pos[0] + i][pos[1] + j]) {
                res++;
            }
        }
    }
    return res;
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

function setNewPosPuzzle(puzzlePos, nr) {
    var len = 30 - 6;
    var pos = [];
    for (i = 0; i < 1; i++) {
        var x = getMaxRandom(len);
        var y = getMaxRandom(len);
        if (checkPosiSGood(x, y, puzzlePos, nr)) {
            pos = [x, y];
        } else {
            i--;
        }
    }
    return pos;
}

function changeSmallPuzzle(pos, table, id, type) {
    var c = document.getElementById("puzzle" + id);
    var ctx = c.getContext("2d");
    ctx.fillStyle = 'white';
    fillPuzzle(table, pos, type, ctx);
}



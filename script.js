

var shema = getzeroshema();
var difficulity = [
  [10, "Very Easy"],
  [20, "Easy"],
  [40, "Medium"],
  [60, "Hard"],
  [80, "Very Hard"]
];


var data = {
  stan: 0,

  options: [10, 1],
  puzzlesPos: [],
  nrPuzzless: 4,
  schema: shema,
  difficulity: difficulity,
  gametime: 1000,
  time: 1000,
  points: 0,
  endgame: 0,
  stepGoodFit: 3,
  step: 0,
  isGoodFit: 0,
  goodPuzzle: 0,
  topY: 0
};


new Vue({
  el: '#app',
  data: data,

  methods: {

    start: function () {

      clearRect();
      data.schema = createRandomMap(data.schema, data.options[0]);
      data.puzzlesPos = getPosPuzzles(data.nrPuzzless);
      fillBigCanva(data.schema, data.options[1]);
      fillSmallCanva(data.schema, data.puzzlesPos, data.options[1]);

      data.stan = 1;
      data.time = parseInt(data.gametime);
      data.endgame = 0;
      data.points = 0;
      this.interval = setInterval(this._tick, 100);
    },
    reloadGame: function () {
      clearInterval(this.interval);
      this.start();
    },
    stopGame: function () {
      clearInterval(this.interval);
      this.backSmallPuzzles();
      data.endgame = 1;
    },
    backSmallPuzzles: function () {
      targets = document.getElementsByClassName('smallPuzzle');
      for (var i = 0; i < targets.length; i++) {
        targets[i].style.position = "static";
      }
    },
    seeSolution: function () {
      seeSolution(data.puzzlesPos);
      this.stopGame();
    },

    draw: function (e) {

      if (!this.isDrawing && data.endgame == 1) return;

      const clickedBox = e.target.closest('.puzz canvas');
      var rect = clickedBox.getBoundingClientRect();
      var pos = clickedBox.getAttribute("data-id");

      var c = document.getElementById("myCanvas");
      var crect = c.getBoundingClientRect();
      clickedBox.style.position = 'absolute';
      clickedBox.style.opacity = '0.5';
      clickedBox.style.top = e.clientY - crect.top + "px";
      clickedBox.style.left = e.clientX - crect.left - 90 + "px";

      if (checkposFit(data.puzzlesPos[pos - 1], [e.clientX - crect.left - 90, e.clientY - crect.top - e.offsetY])) {
        this.isGoodFit = 1;
        this.goodPuzzle = pos;
      } else {
        data.isGoodFit = 0;
        data.step = 0;
      }

    },
    stopDrawing: function (e) {
      this.isDrawing = false;
      const clickedBox = e.target.closest('.puzz canvas');
      clickedBox.style.position = 'static';
      clickedBox.style.opacity = '1';
    },
    startDrawing(e) {

      if (data.endgame == 1) return;
      this.isDrawing = true;
      const clickedBox = e.target.closest('.puzz canvas');
      var rect = clickedBox.getBoundingClientRect();
      var c = document.getElementById("myCanvas");
      var crect = c.getBoundingClientRect();

      clickedBox.style.position = 'absolute';
      clickedBox.style.opacity = '0.5';
      this.x = rect.x - crect.x;
      this.y = rect.y - crect.y;
      clickedBox.style.left = rect.x - crect.x + "px";
      clickedBox.style.top = e.clientY + "px";

    },

    _tick: function () {
      this.time--;
      if (this.time <= 0) {
        this.stopGame();
      }
      if (this.isGoodFit) {
        this.step++;
      }
      if (this.step >= this.stepGoodFit) {
        this.step = 0;
        this.isGoodFit = 0;
        this.points += addPoints(this.puzzlesPos[this.goodPuzzle - 1], data.schema)
        this.backSmallPuzzles();

        data.schema = changePlaceInBigCanva(this.puzzlesPos[this.goodPuzzle - 1], data.schema, data.options[0]);
        fillBigCanva(data.schema, data.options[1]);

        data.puzzlesPos[this.goodPuzzle - 1] = setNewPosPuzzle(data.puzzlesPos, this.goodPuzzle - 1);
        changeSmallPuzzle(data.puzzlesPos[this.goodPuzzle - 1], data.schema, this.goodPuzzle, data.options[1]);

      } else {
        fillBigCanva(data.schema, data.options[1]);
        fillSmallCanva(data.schema, data.puzzlesPos, data.options[1]);
      }
    },
    setGraphs: function () {
      setGraphics(data.options[1]);
    },

  },

});

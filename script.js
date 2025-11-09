
initValue = [1, 1, 1];
Automa = new Automa(...initValue);
let shema = Automa.getMap();
let colors = ['white', 'blue', 'green', 'chocolate'];

var colorsList = [
  [1, "1 Kolor"],
  [2, "2 Kolory"],
  [3, "3 Kolory"],
];

var data = {
  stan: 0,
  options: initValue,
  gametime: 1000,
  puzzlesPos: [],
  nrPuzzless: 4,
  schema: shema,
  time: 1000,
  points: 0,
  endgame: 0,
  stepGoodFit: 3,
  step: 0,
  isGoodFit: 0,
  goodPuzzle: 0,
  stangame: "",
  automa: Automa,
  colors: colors,
  colorsList: colorsList
};


new Vue({
  el: '#app',
  data: data,

  methods: {

    start: function () {

      clearRect();

      data.automa.createMap();

      data.schema = data.automa.getMap();
      params = data.automa.getParams();
      fillBigCanva(data.schema, params);

      data.puzzlesPos = getPosPuzzles(data.nrPuzzless, params);
      fillSmallCanva(data.schema, data.puzzlesPos, params);

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
    setPattern: function () {
      data.automa.changePattern(data.options[1]);
    },
    setSize: function () {
      data.automa.changeSize(data.options[0]);
    },
    changeColors: function () {
      data.automa.changeColors(data.options[2]);
    },
    backSmallPuzzles: function () {
      targets = document.getElementsByClassName('smallPuzzle');
      for (var i = 0; i < targets.length; i++) {
        targets[i].style.position = "static";
      }
    },
    seeSolution: function () {
      seeSolution(data.puzzlesPos, data.automa.getParams());
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
      clickedBox.style.top = e.clientY - crect.top + 60 + "px";
      clickedBox.style.left = e.clientX - crect.left - 60 + "px";

      if (checkposFit(data.puzzlesPos[pos - 1], [e.clientX - crect.left - 60, e.clientY - crect.top - e.offsetY], data.automa.getParams())) {
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
      clickedBox.style.top = rect.y - crect.y + "px";

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
        this.points += 10;
        this.backSmallPuzzles();

        data.automa.changePlace(this.puzzlesPos[this.goodPuzzle - 1]);
        data.schema = data.automa.getMap();
        params = data.automa.getParams();
        fillBigCanva(data.schema, params);

        data.puzzlesPos[this.goodPuzzle - 1] = setNewPosPuzzle(data.puzzlesPos, this.goodPuzzle - 1, data.automa.getParams());
        changeSmallPuzzle(data.puzzlesPos[this.goodPuzzle - 1], data.schema, this.goodPuzzle, data.automa.getParams());

      } else {
        fillBigCanva(data.schema, data.options[1]);
        fillSmallCanva(data.schema, data.puzzlesPos, data.options[1]);
      }
    },


  },

});

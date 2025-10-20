import Konva from "konva";

import "./style.css";

const stage = new Konva.Stage({
  container: "app",
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4,
});

layer.add(circle);

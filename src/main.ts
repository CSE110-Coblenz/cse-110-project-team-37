import Konva from "konva";
import { createPauseScreen } from "../PauseScreen/PauseScreen";

import "./style.css";

const stage = new Konva.Stage({
  container: "app",
  width: window.innerWidth,
  height: window.innerHeight,
});

const pauseLayer = createPauseScreen(stage);
stage.add(pauseLayer);

// Keep responsive
window.addEventListener("resize", () => {
  stage.size({ width: window.innerWidth, height: window.innerHeight });
  // call the relayout hook we attached
  (pauseLayer as any).relayout?.();
});

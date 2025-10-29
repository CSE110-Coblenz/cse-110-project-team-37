// PauseScreen/PauseScreen.ts
import Konva from "konva";

type ButtonSpec = {
  label: string;
};

const BUTTONS: ButtonSpec[] = [
  { label: "Resume" },
  { label: "Help" },
  { label: "Restart" },
  { label: "Quit" },
];

export function createPauseScreen(stage: Konva.Stage): Konva.Layer {
  const layer = new Konva.Layer();

  // ====== Title ======
  const title = new Konva.Text({
    text: "Paused",
    fontSize: 40,
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
    fill: "#111827", // near-black
    align: "center",
  });
  layer.add(title);

  // ====== Buttons (visual only; with hover highlight) ======
  const buttonGroups: Konva.Group[] = [];
  const buttonHeight = 48;
  const buttonGap = 12;
  const padX = 24; // horizontal padding inside panel area

  for (const { label } of BUTTONS) {
    const g = new Konva.Group({ listening: true });

    const rect = new Konva.Rect({
      fill: "#F3F4F6", // gray-100
      cornerRadius: 12,
      shadowColor: "#000",
      shadowBlur: 0,
      shadowOpacity: 0,
    });

    const text = new Konva.Text({
      text: label,
      fill: "#111827", // gray-900
      fontSize: 18,
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
      align: "center",
    });

    g.add(rect);
    g.add(text);

    // Hover highlight (no click action)
    g.on("mouseenter", () => {
      stage.container().style.cursor = "pointer";
      rect.fill("#E5E7EB"); // gray-200
      rect.shadowBlur(8);
      rect.shadowOpacity(0.15);
      layer.batchDraw();
    });
    g.on("mouseleave", () => {
      stage.container().style.cursor = "default";
      rect.fill("#F3F4F6");
      rect.shadowBlur(0);
      rect.shadowOpacity(0);
      layer.batchDraw();
    });

    layer.add(g);
    buttonGroups.push(g);
  }

  // ====== Layout: centers content, keeps responsive ======
  function layout() {
    const W = stage.width();
    const H = stage.height();

    // Title width for centering
    title.width(W);
    // Top margin
    const topMargin = Math.max(24, Math.round(H * 0.08));
    title.position({ x: 0, y: topMargin });

    // Calculate button column width
    const maxButtonWidth = Math.min(520, Math.max(280, Math.round(W * 0.6)));
    const bw = Math.max(220, Math.min(maxButtonWidth, W - padX * 2));

    // Start buttons beneath title with spacing
    let y = title.y() + title.height() + 24;

    for (const g of buttonGroups) {
      const rect = g.findOne<Konva.Rect>("Rect")!;
      const text = g.findOne<Konva.Text>("Text")!;

      rect.size({ width: bw, height: buttonHeight });

      // horizontally center column
      const x = (W - bw) / 2;

      rect.position({ x, y });

      text.width(bw);
      text.x(x);
      // vertically center text in rect
      text.y(y + (buttonHeight - text.height()) / 2);

      g.position({ x: 0, y: 0 }); // groups use child positions; keep group origin at 0

      y += buttonHeight + buttonGap;
    }

    layer.batchDraw();
  }

  layout();

  // Consumers can call this if they resize the stage manually.
  (layer as any).relayout = layout;

  // Helpful if you manage global resize in main.ts
  // (You can also keep this file “pure” and do the listener in main.ts)
  const onResize = () => {
    layout();
  };
  window.addEventListener("resize", onResize);

  // Clean-up API (optional)
  (layer as any).destroyWithEvents = () => {
    window.removeEventListener("resize", onResize);
    layer.destroy();
  };

  return layer;
}

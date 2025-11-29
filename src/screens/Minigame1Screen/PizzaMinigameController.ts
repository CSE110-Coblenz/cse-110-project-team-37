import { Fraction } from "../../models/Fraction.ts";
import { ScreenController } from "../../types.ts";

import { PizzaMinigameModel } from "./PizzaMinigameModel.ts";
import { PizzaMinigameView } from "./PizzaMinigameView.ts";

import type { ScreenSwitcher } from "../../types.ts";
import type { GameState } from "../../models/GameState.ts";

export class PizzaMinigameController extends ScreenController {
  private readonly view: PizzaMinigameView;
  private readonly screenSwitcher: ScreenSwitcher;
  private readonly gameState: GameState;
  private readonly model: PizzaMinigameModel;

  // All available slices for the game
  private readonly fractionOptions: Fraction[] = [
    new Fraction(1, 2),
    new Fraction(1, 3),
    new Fraction(1, 4),
    new Fraction(1, 6),
    new Fraction(1, 8),
    new Fraction(1, 12),
    new Fraction(1, 24),
  ];

  constructor(screenSwitcher: ScreenSwitcher, gameState: GameState) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.gameState = gameState;

    this.model = new PizzaMinigameModel(this.fractionOptions);

    this.view = new PizzaMinigameView({
      fractionOptions: this.fractionOptions,
      onBack: () => {
        // Reset counters when leaving
        this.model.resetCounters();
        this.screenSwitcher.switchToScreen({ type: "menu" });
      },
      onReset: () => {
        this.startNewPizza();
      },
      onSliceClick: (slice) => {
        this.handleSliceClick(slice);
      },
      onReady: () => {
        // View + texture ready; start the first pizza
        this.startNewPizza();
      },
    });
  }

  getView(): PizzaMinigameView {
    return this.view;
  }

  // ---------------- Private helpers ----------------

  /**
   * Start a fresh pizza: clear visuals, random starting slice, reset HUD.
   */
  private startNewPizza(): void {
    this.view.clearSlices();

    const start = this.model.resetWithRandomStart();

    this.view.setCurrentFractionText(this.model.getCurrent());
    this.view.setStatusText("Click a fraction to add a slice");
    this.view.updatePizzasCompleted(this.model.getPizzasCompleted());

    // Draw the initial slice from 0 to `start`
    const zero = new Fraction(0, 1);
    this.view.addSliceVisual(zero, start);
  }

  private handleSliceClick(slice: Fraction): void {
    if (!this.model.canAdd(slice)) {
      this.view.setStatusText("That would overflow the pizza. Try a smaller slice.");
      return;
    }

    const { previous, next, completed } = this.model.addSlice(slice);

    this.view.addSliceVisual(previous, slice);
    this.view.setCurrentFractionText(next);

    if (completed) {
      this.view.setStatusText("Perfect! Pizza completed!");
      this.view.updatePizzasCompleted(this.model.getPizzasCompleted());
      this.view.flashPizzaSuccess();

      this.gameState.addBonus(3);
      // After glow, start the next pizza
      window.setTimeout(() => {
        this.startNewPizza();
        this.screenSwitcher.switchToScreen({ type: "board" });
      }, 500);
    } else {
      this.view.setStatusText(`Added ${slice.toString()}.`);
    }
  }
}

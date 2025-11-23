// screens/Minigame1Screen/PizzaMinigameModel.ts
import { Fraction } from "../../models/Fraction";

export type AddResult =
  | { kind: "overflow" }
  | { kind: "partial"; current: Fraction; remaining: Fraction }
  | { kind: "completed"; current: Fraction };

export class PizzaMinigameModel {
  private readonly options: Fraction[];
  private current: Fraction = new Fraction(0, 1);
  private readonly one = new Fraction(1, 1);
  private pizzasCompleted = 0;

  constructor(options: Fraction[]) {
    this.options = options;
  }

  getCurrent(): Fraction {
    return this.current;
  }

  getPizzasCompleted(): number {
    return this.pizzasCompleted;
  }

  getOptions(): readonly Fraction[] {
    return this.options;
  }

  resetRandom(): Fraction {
    this.current = new Fraction(0, 1);

    const start = this.options[Math.floor(Math.random() * this.options.length)];
    this.current = start.simplify();

    return this.current;
  }

  addSlice(slice: Fraction): AddResult {
    const next = this.current.add(slice).simplify();

    // overflow if next > 1  ⇔ (1 - next) has negative numerator
    const diff = this.one.subtract(next).simplify();
    if (diff.numerator < 0) {
      return { kind: "overflow" };
    }

    this.current = next;

    if (this.current.equals(this.one)) {
      this.pizzasCompleted += 1;
      return { kind: "completed", current: this.current };
    }

    const remaining = this.one.subtract(this.current).simplify();
    return { kind: "partial", current: this.current, remaining };
  }

  resetCounters(): void {
    this.pizzasCompleted = 0;
  }
}

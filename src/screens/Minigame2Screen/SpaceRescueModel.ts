// src/screens/MinigameScreen/SpaceRescueModel.ts
import { Fraction } from "../../models/Fraction";
// Assuming you have a standard Fraction model and a DiceService for randomness

// Define the number of asteroids (fractions) for a single rescue path
const ASTEROID_COUNT = 5;

export class SpaceRescueModel {
  // Array of fractions displayed on the asteroids
  public asteroids: Fraction[];

  // The correct sequence the player must click
  private targetOrder: Fraction[];

  // Tracks the index of the next fraction the player should click
  private currentTargetIndex: number = 0;

  // The required order (e.g., 'ascending' or 'descending')
  public sortOrder: "ascending" | "descending";

  constructor() {
    // Randomly choose the sorting order for the round
    this.sortOrder = Math.random() > 0.5 ? "ascending" : "descending";

    // Generate the fractions and set up the order
    this.asteroids = this.generateRandomFractions(ASTEROID_COUNT);
    this.targetOrder = this.sortFractions(this.asteroids, this.sortOrder);

    this.reset();
  }

  public reset(): void {
    // 1. Randomly choose the sorting order for the round
    // Need to use `this.` if you want the sort order to be stored on the model instance
    this.sortOrder = Math.random() > 0.5 ? "ascending" : "descending"; // 2. Generate new fractions and set up the order

    this.asteroids = this.generateRandomFractions(ASTEROID_COUNT);
    this.targetOrder = this.sortFractions(this.asteroids, this.sortOrder); // 3. Reset the progress
    this.currentTargetIndex = 0;
  }

  private generateRandomFractions(count: number): Fraction[] {
    const fractions: Fraction[] = [];
    // NOTE: In a real app, you'd use your QuestionService to generate these for variety.
    // For simplicity, we create fixed ones here:
    for (let i = 0; i < count; i++) {
      // Example: Create random fractions for diversity
      fractions.push(
        new Fraction(
          Math.floor(Math.random() * 8) + 1,
          Math.floor(Math.random() * 8) + 2,
        ).simplify(),
      );
    }
    return fractions;
  }

  private sortFractions(fractions: Fraction[], order: "ascending" | "descending"): Fraction[] {
    // Create a copy and sort based on decimal value
    const sorted = [...fractions].sort((a, b) => {
      const valA = a.toDecimal();
      const valB = b.toDecimal();
      return order === "ascending" ? valA - valB : valB - valA;
    });
    return sorted;
  }

  /**
   * Checks if the clicked fraction is the next correct one in the sequence.
   */
  public checkClick(clickedFraction: Fraction): boolean {
    // The expected fraction for the current step
    const expectedFraction = this.targetOrder[this.currentTargetIndex];

    // Use the Fraction model's equals method (which simplifies before comparing)
    if (clickedFraction.equals(expectedFraction)) {
      this.currentTargetIndex++;
      return true;
    }
    return false;
  }

  public getTargetOrder(): Fraction[] {
    return this.targetOrder; // Safely exposes the private array
  }

  public isRoundComplete(): boolean {
    return this.currentTargetIndex >= this.targetOrder.length;
  }

  public getNextTargetIndex(): number {
    return this.currentTargetIndex;
  }
}

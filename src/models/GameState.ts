
export type Difficulty = "Easy" | "Medium" | "Hard";

export class GameState {
  private difficulty: Difficulty;
  private bonusRoll: number;

  /*
   * Constructor for class.
   */
  constructor() {
    this.difficulty = "Easy";
    this.bonusRoll = 6;
  }

  /*
   * Get current bonus roll value.
   */
  public getBonus() {
    return this.bonusRoll;
  }

  /*
   * Add bonus to next roll value
   */
  public addBonus(bonus: number) {
    this.bonusRoll += bonus;
  }

  /*
   * Returns queston difficulty
   */
  public getDifficulty(): Difficulty {
    return this.difficulty;
  }

  /*
   * Sets queston difficulty
   */
  public setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }
}

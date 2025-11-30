
export type Difficulty = "Easy" | "Medium" | "Hard";

export class GameState {
  private difficulty: Difficulty;
  private bonusRoll: number;
  private turnCounter: number;

  /*
   * Constructor for class.
   */
  constructor() {
    this.difficulty = "Easy";
    this.bonusRoll = 0;
    this.turnCounter = 0;
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

  /*
   * Get current turn count
   */
  public getTurnCount(): number {
    return this.turnCounter;
  }

  /*
   * Advance current turn by 1
   */
  public incrementTurn(): void {
    this.turnCounter += 1;
  }
}

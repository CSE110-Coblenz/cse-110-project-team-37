/**
 * EndScreenModel - Manages game state
 */
export class EndScreenModel {
  private gameOver = false;
  private score = 0;

  /**
   * Reset game state for a new game
   */
  reset(): void {
    this.score = 0;
    this.gameOver = false;
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Return state of the game
   */
  isGameOver(): boolean {
    return this.gameOver;
  }
}

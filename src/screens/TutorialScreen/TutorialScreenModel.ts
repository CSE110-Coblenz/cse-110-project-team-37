/**
 * TutorialScreenModel - Manages game state
 */
export class TutorialModel {
  private readonly lines: string[];
  private index = 0;

  constructor() {
    this.lines = [
      "Hello, Player! Welcome to Fraction Mania!",
      "Your mission is to navigate the board and overcome fraction challenges.",
      "Each stop along the path will give you a minigame to solve.",
      "Complete the challenges to reach the finish... or be trapped forever!",
    ];
  }

  reset(): void {
    this.index = 0;
  }

  getCurrentLine(): string | null {
    if (this.index < this.lines.length) {
      return this.lines[this.index];
    }
    return null;
  }

  advance(): string | null {
    if (this.index < this.lines.length - 1) {
      this.index++;
      return this.lines[this.index];
    }
    return null;
  }

  isLastLine(): boolean {
    return this.index === this.lines.length - 1;
  }
}

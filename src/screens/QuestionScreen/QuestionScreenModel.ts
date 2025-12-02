import type { Fraction } from "../../models/Fraction.ts";
import type { Question } from "../../services/QuestionService";

/**
 * note: new controller instance is created for each question. this is not good 
 * MVC i realize now (model should update state and controller should respond) but 
 * when i was attempting to replicate lab code this made sense, as the main "game"
 * was only played once 
 */
export class QuestionScreenModel {
  private readonly currentQuestion: Question;

  /**
   * constructs a new QuestionScreenModel with a question
   */
  constructor(question: Question) {
    this.currentQuestion = question;
  }

  /**
   * checks if the answer is correct
   */
  checkAnswer(selectedIndex: number): boolean {
    return selectedIndex === this.currentQuestion.correctAnswerIndex;
  }

  /**
   * gets string representation of the current question
   */
  getCurrentExpression(): string {
    return this.currentQuestion.expression;
  }

  /**
   * gets an array of answer choices (fractions) for the current question
   */
  getAnswerChoices(): Fraction[] {
    return this.currentQuestion.choices;
  }
}

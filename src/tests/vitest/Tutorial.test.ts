import { describe, expect, it } from "vitest";

import { TutorialModel } from "../../screens/TutorialScreen/TutorialScreenModel.ts";

describe("tutorialModel", () => {
  it("starts at first line after reset", () => {
    const model = new TutorialModel();
    model.reset();
    const first = model.getCurrentLine();
    expect(first).toBeDefined();
  });

  it("advances through all lines then stops", () => {
    const model = new TutorialModel();
    model.reset();

    const first = model.getCurrentLine();
    const second = model.advance();
    expect(second).not.toBe(first);

    // Eventually no more lines
    let last = second;
    for (let i = 0; i < 10; i++) {
      const next = model.advance();
      if (next === null) {
        last = next;
        break;
      }
    }
    expect(last).toBeNull();
  });

  it("isLastLine is true only on final line", () => {
    const model = new TutorialModel();
    model.reset();
    expect(model.isLastLine()).toBe(false);

    // advance to the end
    let next: string | null;
    do {
      next = model.advance();
    } while (next !== null);

    expect(model.isLastLine()).toBe(true);
  });
});

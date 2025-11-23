// THIS FILE WILL RENDER THE ASTEROID GENERATION
import Konva from "konva";

// we will need the Fraction model
import type { Fraction } from "../../../models/Fraction";

// creating a type for the renderer that stores all necessary information for the renderer to create the visuals
type AsteroidCreateOptions = {
  fractions: Fraction[];
  asteroidImage: Konva.Image;
  onFractionClick: (fraction: Fraction) => void;
  parentGroup: Konva.Group;
};

/**
 * handles creation, animation, and interactions for asteroids.
 */
export class AsteroidRenderer {
  /**
   * creates the asteroids and returns a map of fractions
   * that correspond to certain asteroids
   * @param options this corresponds to the type defined above. all member variables will
   * be necessary to carry out visual rendering
   * @returns map of fractions that corresponds to the asteroids
   */
  static createAsteroids(options: AsteroidCreateOptions): Map<Fraction, Konva.Group> {
    // extracting member variables of our Options class (passed through parameter)
    const { fractions, asteroidImage, onFractionClick, parentGroup } = options;

    // initializing map that will store asteroids (Fractions)
    const fractionNodes = new Map<Fraction, Konva.Group>();

    // defining dimensions we want to use
    // we will use the values of the parent group. if null, just use standard screen resolution
    // (1920 x 1080)
    const STAGE_WIDTH = parentGroup.getStage()?.width() ?? 1920;
    const STAGE_HEIGHT = parentGroup.getStage()?.height() ?? 1080;

    // defining center of the screen and predetermining size of asteroid
    const center = STAGE_WIDTH / 2;
    const ASTEROID_SIZE = 250;

    // now, for each fraction in list of fractions fed in parameter, create a specific asteroid linked to that fraction
    fractions.forEach((fraction, index) => {
      // trying to simulate 'random positioning'
      const x = center + (Math.random() - 0.5) * 1200;
      const y = STAGE_HEIGHT / 5.5 + index * 160;

      // creating a new group that holds the asteroids
      const asteroidGroup = new Konva.Group({ x, y });

      // clone asteroid image
      const rock = asteroidImage.clone({
        width: ASTEROID_SIZE,
        height: ASTEROID_SIZE,
        offsetX: ASTEROID_SIZE / 2,
        offsetY: ASTEROID_SIZE / 2,
      }) as Konva.Image;

      // fraction that goes inside the asteroid
      const label = new Konva.Text({
        text: fraction.toString(),
        fontSize: 32,
        fill: "black",
        y: -10,
      });
      label.offsetX(label.width() / 2);

      // adding the rock with the text inside it to the group
      asteroidGroup.add(rock, label);

      // adding a click handler
      asteroidGroup.on("click", () => {
        AsteroidRenderer.runClickAnimation(asteroidGroup);
        onFractionClick(fraction);
      });

      // hover animation (scales up)
      asteroidGroup.on("mouseenter", () => {
        document.body.style.cursor = "pointer";
        new Konva.Tween({
          node: asteroidGroup,
          scaleX: 1.12,
          scaleY: 1.12,
          duration: 0.15,
        }).play();
      });

      // when hover ends, go back to normal
      asteroidGroup.on("mouseleave", () => {
        document.body.style.cursor = "default";
        new Konva.Tween({
          node: asteroidGroup,
          scaleX: 1,
          scaleY: 1,
          duration: 0.15,
        }).play();
      });

      // add to render tree
      parentGroup.add(asteroidGroup);

      // store reference
      fractionNodes.set(fraction, asteroidGroup);

      // animations
      AsteroidRenderer.addDriftAnimation(asteroidGroup);
      AsteroidRenderer.addRotationAnimation(rock);
    });

    // return the map
    return fractionNodes;
  }

  /**
   * click animation (pop-up then shrink back).
   * @param group animation will be played on this group specifically
   */
  static runClickAnimation(group: Konva.Group) {
    new Konva.Tween({
      node: group,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 0.12,
      // once click is done, go back to normal
      onFinish: () => {
        new Konva.Tween({
          node: group,
          scaleX: 1,
          scaleY: 1,
          duration: 0.12,
        }).play();
      },
    }).play();
  }

  /**
   * drifting animation. looks like asteroid is floating
   * @param group animation will be played on this group specfically
   */
  static addDriftAnimation(group: Konva.Group) {
    // defining drify constants
    const driftX = (Math.random() - 0.5) * 50;
    const driftY = (Math.random() - 0.5) * 50;

    // creating the animation
    new Konva.Tween({
      node: group,
      x: group.x() + driftX,
      y: group.y() + driftY,
      duration: 4 + Math.random() * 2,
      yoyo: true,
      repeat: Infinity,
    }).play();
  }

  /**
   * rotation to add depth to the drift
   * @param rock the animation will be given to each asteroid individually
   * that way each rock looks like they're turning in different directions
   */
  static addRotationAnimation(rock: Konva.Image) {
    new Konva.Tween({
      node: rock,
      rotation: 10 + Math.random() * 20,
      duration: 5 + Math.random() * 2,
      yoyo: true,
      repeat: Infinity,
    }).play();
  }
}

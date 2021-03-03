import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  init() {}

  // load assets
  preload() {
    // this.load.image("background", "assets/images/background-city.png");
    // this.load.audio("treeAudio", "assets/audio/arbol.mp3");
  }

  // executed once, after assets were loaded
  create() {}

  update(time, delta) {}
}
import Phaser from "phaser";
import config from "../config.json";
import { Vacancy } from "../classes/Vacancy";

export class VacanciesScene extends Phaser.Scene {
  constructor() {
    super("VacanciesScene");
  }

  init() {}

  preload() {}

  // executed once, after assets were loaded
  create() {
    const name = this.registry.get("name");
    this.welcomeMessage = this.add
      .text(400, 30, `${name}, you have 3 job offers!`, {
        font: "24px Open Sans",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0);
    this.createCompanyVacancies();
    console.log(this.scene);
  }

  update(time, delta) {}

  createCompanyVacancies() {
    // 175 + 175 + 150
    // 500
    const companies = Phaser.Math.RND.shuffle(config.companies).slice(0, 3);
    this.companies = companies.map((company, idx) => {
      const x = 50 + (idx + 1) * 175;
      return this.add.existing(
        new Vacancy(this, x, 150, company, this.startGame.bind(this))
      );
    }, this);
  }

  startGame(company) {
    this.registry.set("company", company);
    this.scene.start("MainScene");
  }
}

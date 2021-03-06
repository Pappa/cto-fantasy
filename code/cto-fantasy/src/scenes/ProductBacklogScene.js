import Phaser from "phaser";
import { Backlog } from "../game-objects/Backlog";
import { SceneBackground } from "../game-objects/SceneBackground";
import * as theme from "../theme";

export class ProductBacklogScene extends Phaser.Scene {
  constructor() {
    super("ProductBacklogScene");
  }

  init() {}

  preload() {}

  create({ project, sprint, emitter, onClose }) {
    this.project = project;
    this.sprint = sprint;
    this.emitter = emitter;
    this.onClose = onClose;
    this.createComponents();
    this.createEvents();
    this.displayCommitment();
    this.displayBacklog();
    this.displayHelpText();
  }

  update() {
    this.backlog.update();
  }

  createComponents() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.background = new SceneBackground(this, 0, 0, width, height, {
      title: !!this.sprint && "Sprint Planning",
      closeIcon: "complete_icon",
      onClose: () => {
        this.selectCommitment();
        this.onClose();
      },
    });
  }

  createEvents() {
    this.input.keyboard.on("keydown", (event) => {
      if (event.key === "Enter") {
        this.selectCommitment();
        this.onClose();
      }
    });
  }

  selectCommitment() {
    if (this.sprint) {
      const items = this.backlog.getCommittedItems();
      this.emitter.emit("sprint_backlog_selected", items);
    }
  }

  displayCommitment() {
    if (this.sprint) {
      this.add
        .text(
          400,
          50,
          `The team think they can achieve ${this.sprint.commitment} points this sprint.`,
          theme.mainText
        )
        .setOrigin(0.5, 0);
    }
  }

  displayBacklog() {
    this.backlog = new Backlog(this, 100, 100, {
      project: this.project,
      team: this.team,
      commitment: this.sprint && this.sprint.commitment,
      emitter: this.emitter,
    });
  }

  displayHelpText() {
    this.add
      .text(
        400,
        540,
        `* Use the arrow keys to scroll the backlog.\nDrag and drop to reorder items.`,
        { ...theme.mediumText, align: "center" }
      )
      .setOrigin(0.5, 0);
  }

  getEstimateText(item) {
    return item.estimate || "n/a";
  }

  //update(time, delta) {}
}

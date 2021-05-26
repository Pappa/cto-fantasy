import Phaser from "phaser";
import { UserStory } from "../classes/WorkItem";
import * as theme from "../theme";
import { truncate } from "../utils/strings";

export class SprintBoardItem extends Phaser.GameObjects.Container {
  width = 100;
  height = 50;
  constructor(scene, x = 0, y = 0, { item, project, emitter }) {
    super(scene, x, y);
    this.item = item;
    this.project = project;
    this.emitter = emitter;
    this.scene.add.existing(this);

    this.createComponents();
  }

  createComponents() {
    const isUserStory = this.item instanceof UserStory;
    const border = isUserStory ? 0x000000 : 0xaf1504;
    this.background = this.scene.make
      .graphics()
      .fillStyle(0xffffff, 1.0)
      .lineStyle(1, border, 1.0)
      .strokeRect(0, 0, 140, 50);
    this.workItemId = this.scene.make
      .text({
        x: 5,
        y: 35,
        text: `${this.item.id}`,
        style: theme.sprintBoardItemId,
      })
      .setOrigin(0);
    this.title = this.scene.make
      .text({
        x: 5,
        y: 5,
        text: `${truncate(this.item.title, 27)}`,
        style: theme.sprintBoardItemText,
      })
      .setOrigin(0);
    this.estimate = this.scene.make
      .text({
        x: 127,
        y: 35,
        text: `${this.item.estimate || "-"}`,
        style: theme.sprintBoardItemEstimate,
      })
      .setOrigin(0)
      .setVisible(isUserStory);
    this.add([this.background, this.workItemId, this.title, this.estimate]);
  }
}

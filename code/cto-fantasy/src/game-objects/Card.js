import Phaser from "phaser";

export class Card extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0, content = {}, callback) {
    super(scene, x, y);

    this.form = this.scene.add
      .dom(0, 0)
      .createFromCache("card")
      .setOrigin(0.5, 0);
    this.add(this.form);

    this.setTitle(content.title);
    this.setDescription(content.text);
    this.setContent(content);

    this.setButton(content.buttonText, content.disabled, callback);

    this.scene.add.existing(this);
  }

  setTitle(title) {
    this.form.getChildByID("title").textContent = title;
  }

  setDescription(description) {
    this.form.getChildByID("description").innerHTML = description;
  }

  setContent() {}

  setButton(text, disabled, callback) {
    const button = this.form.getChildByID("submit");
    if (callback) {
      button.textContent = text;
      button.disabled = !!disabled;
      button.addEventListener("click", callback);
      // this.button = this.scene.add.existing(
      //   new Button(this.scene, 0, 155, text, callback)
      // );
      // this.add(this.button);
      button.style.display = "inline";
    } else {
      button.style.display = "none";
    }
  }
}

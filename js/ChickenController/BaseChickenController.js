class BaseChickenController {
  constructor(x, y, spriteName, configs) {
    this.sprite = Nakama.chickenGroup.create(x, y, spriteName);
    this.configs = configs;
    this.sprite.animations.add('run');
    this.sprite.animations.play('run', this.configs.speed, true);
  }
}

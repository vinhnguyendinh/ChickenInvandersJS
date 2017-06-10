class BaseChickenController {
  constructor(x, y, spriteName, configs) {
    this.position = {
      x: x,
      y: y
    }
    this.sprite = Nakama.enemyGroup.create(x, y, spriteName);
    this.configs = configs;
    this.sprite.animations.add('run');
    this.sprite.animations.play('run', this.configs.speed, true);
    // Health
    this.sprite.health = 2;
  }
}

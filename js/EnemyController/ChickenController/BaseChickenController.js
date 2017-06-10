class BaseChickenController {
  constructor(x, y, spriteName, configs) {
    this.position = {
      x: x,
      y: y
    }
    Object.assign(configs, {
        cooldown: 0.7
    });
    this.sprite = Nakama.enemyGroup.create(x, y, spriteName);
    this.configs = configs;
    this.sprite.animations.add('run');
    this.sprite.animations.play('run', this.configs.speed, true);
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    this.sprite.health = 1;


  }

  update() {}

}

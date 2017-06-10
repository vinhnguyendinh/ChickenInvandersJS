class StoneController {
  constructor(x, y, spriteName, configs) {
    Object.assign(configs, {
        cooldown: 0.7,
        direction: new Phaser.Point(1, 5),
    });
    this.position = {
      x: x,
      y: y
    }
    this.configs = configs;
    this.timeSinceLastFire = 0;
    this.sprite = Nakama.enemyGroup.create(x, y, 'assets', spriteName);
    this.sprite.body.velocity = configs.direction.setMagnitude(configs.speed);
    this.sprite.health = 2;
  }

  update() {

  }

}

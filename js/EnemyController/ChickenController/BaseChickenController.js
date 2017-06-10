class BaseChickenController extends BaseEnemyController {
  constructor(x, y, spriteName, configs) {
    Object.assign(configs, {
        cooldown: 0.7,
    });
    super(x, y, spriteName, configs);
    this.sprite.animations.add('run');
    this.sprite.animations.play('run', this.configs.speed, true);
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    this.sprite.health = 1;
  }

  update() {
    if (this.sprite.alive) {
      this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
      if (this.timeSinceLastFire > this.configs.cooldown) {
        this.fire();
        this.timeSinceLastFire = 0;
      }
    }
  }

  fire() {
    this.createBullet(new Phaser.Point(0, 1));
  }

  createBullet(direction) {
    new BulletEnemyController(this.sprite.position.x, this.sprite.position.y, 'e1.png', {
      direction: direction,
      speed: 150
    });
  }

}

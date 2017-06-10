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
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    this.sprite.health = 2;
    this.timeSinceLastFire = 0;
    this.configs.cooldown = 0.7;

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

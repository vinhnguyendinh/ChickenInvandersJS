class ChickenType1Controller extends BaseChickenController {
  constructor(x, y, spriteName, configs) {
    super(x, y, spriteName, configs);
    this.timeSinceLastFire = 0;
  }

  update() {
    if (this.sprite.alive) {
      this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
      if (this.timeSinceLastFire > this.configs.cooldown) {
        this.enemyfire();
        this.timeSinceLastFire = 0;
      }
    }
    
  }

  enemyfire() {
    this.createBullet(new Phaser.Point(0, 1));
  }
  createBullet(direction) {
    new BulletEnemyController(this.sprite.position.x, this.sprite.position.y, 'e1.png', {
      direction: direction,
      speed: 150
    });
  }

}

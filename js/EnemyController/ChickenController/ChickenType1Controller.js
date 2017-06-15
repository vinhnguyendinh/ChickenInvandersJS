class ChickenType1Controller extends BaseChickenController {
  constructor(x, y, spriteName, configs) {
    Object.assign(configs, {
        heath   :2,
        min     :10,
        max     :540,
        cooldown: 0.7
    });
    super(x, y, spriteName, configs);
    this.timeSinceLastFire = 0;
    this.configs = configs;
    this.sprite.animations.add('run');
    this.sprite.animations.play('run', this.configs.speed, true);
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    this.timeSinceLastFire = 0;
    this.timeSinceSpawn = 0;
    this.configs.center = (this.configs.min + this.configs.max) / 2;
    this.configs.distance = (this.configs.max - this.configs.min) / 2;
  }


  update() {
    var period = Nakama.game.time.now * 0.0010;
    var radius = 220;
    this.sprite.position.x = this.configs.center + Math.cos(period) * radius;
    this.sprite.position.y = this.configs.distance + Math.sin(period) * radius;
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

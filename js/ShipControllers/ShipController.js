class ShipController {

  constructor(x, y, spriteName, configs) {
    this.sprite = Nakama.playerGroup.create(x, y, 'assets', spriteName);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);

    this.configs = configs;
    this.timeSinceLastFire = 0;
  }

  update() {
    // Move our space
    if (Nakama.keyboard.isDown(this.configs.up)) {
      this.sprite.body.velocity.y = -this.configs.speed;
    } else if (Nakama.keyboard.isDown(this.configs.down)) {
      this.sprite.body.velocity.y = this.configs.speed;
    } else {
      this.sprite.body.velocity.y = 0;
    }

    if (Nakama.keyboard.isDown(this.configs.left)) {
      this.sprite.body.velocity.x = -this.configs.speed;
    } else if (Nakama.keyboard.isDown(this.configs.right)) {
      this.sprite.body.velocity.x = this.configs.speed;
    } else {
      this.sprite.body.velocity.x = 0;
    }

    this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
    // Throtting
    if (Nakama.keyboard.isDown(this.configs.fire) && this.timeSinceLastFire > this.configs.cooldown) {
      this.fire();
      this.timeSinceLastFire = 0;
    }
  }

  fire() {
    this.createBullet(new Phaser.Point(0, -1));
    this.createBullet(new Phaser.Point(1, -5));
    this.createBullet(new Phaser.Point(-1, -5));
    this.createBullet(new Phaser.Point(1, -2));
    this.createBullet(new Phaser.Point(-1, -2));
  }

  createBullet(direction) {
    new BulletType1Controller(this.sprite.position.x, this.sprite.position.y, {
        direction: direction
    });
  }
}

class ShipController {

  constructor(x, y, spriteName, configs) {
    this.sprite = Nakama.playerGroup.create(x, y, 'assets', spriteName);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor = new Phaser.Point(0.5, 0.5);

    this.configs = configs;
    this.timeSinceLastFire = 0;

    this.spriteRocket = Nakama.playerGroup.create(x, y, 'rocketPlayer');
    this.spriteRocket.animations.add('run');
    this.spriteRocket.animations.play('run', this.configs.speed, true);
    this.spriteRocket.anchor = new Phaser.Point(0.5, -0.5);
  }

  update() {
    if (Nakama.keyboard.isDown(this.configs.up)) {
      this.sprite.position.y = Math.max(this.sprite.position.y - this.configs.speed, 0);
      this.spriteRocket.position.y = Math.max(this.spriteRocket.position.y - this.configs.speed, 0);
    } else if (Nakama.keyboard.isDown(this.configs.down)) {
      this.sprite.position.y = Math.min(this.sprite.position.y + this.configs.speed, Nakama.game.height - this.sprite.height);
      this.spriteRocket.position.y = Math.min(this.spriteRocket.position.y + this.configs.speed, Nakama.game.height - this.spriteRocket.height);
    } else if (Nakama.keyboard.isDown(this.configs.left)) {
      this.sprite.position.x = Math.max(this.sprite.position.x - this.configs.speed, 0);
      this.spriteRocket.position.x = Math.max(this.spriteRocket.position.x - this.configs.speed, 0);
    } else if (Nakama.keyboard.isDown(this.configs.right)) {
      this.sprite.position.x = Math.min(this.sprite.position.x + this.configs.speed, Nakama.game.width - this.sprite.height);
      this.spriteRocket.position.x = Math.min(this.spriteRocket.position.x + this.configs.speed, Nakama.game.width - this.spriteRocket.height);
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
    // this.createBullet(new Phaser.Point(1, -5));
    // this.createBullet(new Phaser.Point(-1, -5));
    // this.createBullet(new Phaser.Point(1, -2));
    // this.createBullet(new Phaser.Point(-1, -2));
  }

  createBullet(direction) {
    new BulletController(this.sprite.position.x, this.sprite.position.y, 'd.png',{
        direction: direction,
        speed    : 1500
    });
  }
}

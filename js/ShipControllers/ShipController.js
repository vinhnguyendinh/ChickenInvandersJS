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
    if (!this.sprite.alive) {
      this.spriteRocket.kill();
    } else {

    }

    if (Nakama.keyboard.isDown(this.configs.up)) {
      this.sprite.position.y = Math.max(this.sprite.position.y - this.configs.speed, 0);
    } else if (Nakama.keyboard.isDown(this.configs.down)) {
      this.sprite.position.y = Math.min(this.sprite.position.y + this.configs.speed, Nakama.game.height - this.sprite.height);
    } else if (Nakama.keyboard.isDown(this.configs.left)) {
      this.sprite.position.x = Math.max(this.sprite.position.x - this.configs.speed, 0);
    } else if (Nakama.keyboard.isDown(this.configs.right)) {
      this.sprite.position.x = Math.min(this.sprite.position.x + this.configs.speed, Nakama.game.width);
    }
    this.spriteRocket.position = this.sprite.position;

    this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
    // Throtting
    if (Nakama.keyboard.isDown(this.configs.fire) && this.timeSinceLastFire > this.configs.cooldown) {
      this.fire();
      this.timeSinceLastFire = 0;
    }
  }

  fire() {
    Nakama.game.add.audio('shoot').play();
    this.createBullet(new Phaser.Point(0, -1));
  }

  createBullet(direction) {
    new BulletController(this.sprite.position.x, this.sprite.position.y, 'd.png',{
        direction: direction,
        speed    : 1500
    });
  }
}

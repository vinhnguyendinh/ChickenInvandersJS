class PlayerController {
  constructor(x, y, spriteName, animateSprite, bullets, configs) {

    // Player
    this.positionX = x;
    this.positionY = y;

    this.sprite = Nakama.game.add.sprite(x, y, 'assets', spriteName);
    this.sprite.anchor.setTo(0.5, 0.5);
    Nakama.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

    // Configs
    this.configs = configs;

    // Rocket
    this.spriteRocket = Nakama.game.add.sprite(x, y, animateSprite);
    this.spriteRocket.animations.add('run');
    this.spriteRocket.animations.play('run', this.configs.rocketSpeed, true);
    this.spriteRocket.anchor = new Phaser.Point(0.5, -0.5);

    //  And some controls to play the game with
    this.fireButton = this.configs.fireButton;
    this.cursors = this.configs.cursors;

    // Time
    this.bulletTime = 0;

    // Bullets
    this.bullets = bullets;

    // Audio
    this.audioShoot = Nakama.game.add.audio(this.configs.audioShoot);
  }

  update() {
    //  Reset the player, then check for movement keys
    this.sprite.body.velocity.setTo(0, 0);

    if (this.cursors.left.isDown)
    {
      this.sprite.body.velocity.x = -this.configs.playerSpeed;
    }
    else if (this.cursors.right.isDown)
    {
      this.sprite.body.velocity.x = this.configs.playerSpeed;
    }

    if (this.cursors.up.isDown)
    {
      this.sprite.body.velocity.y = -this.configs.playerSpeed;
    }
    else if (this.cursors.down.isDown)
    {
      this.sprite.body.velocity.y = this.configs.playerSpeed;
    }

    // Update position player's rocket
    this.spriteRocket.position = this.sprite.position;

    //  Firing?
    if (this.fireButton.isDown)
    {
      this.fireBullet(this.bullets);
    }
  }

  fireBullet(bullets) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (Nakama.game.time.now > this.bulletTime)
    {
      //  Grab the first bullet we can from the pool
      var bullet = bullets.getFirstExists(false);

      if (bullet)
      {
        // Play audio shooter
        this.audioShoot.play();

        //  And fire it
        bullet.reset(this.sprite.x, this.sprite.y + 8);
        bullet.body.velocity.y = -400;
        this.bulletTime = Nakama.game.time.now + 200;
      }
    }
  }

  reset() {
    this.sprite.position.x = this.positionX;
    this.sprite.position.y = this.positionY;

    this.bulletTime = 0;
    this.sprite.revive();
    this.spriteRocket.revive();
  }
}

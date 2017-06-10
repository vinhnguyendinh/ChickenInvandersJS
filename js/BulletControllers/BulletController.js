class BulletController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.bulletGroup.create(x, y, 'assets', spriteName);
        this.sprite.checkWorldBounds = true;
        this.sprite.outOfBoundsKill = true;
        this.sprite.body.velocity = configs.direction.setMagnitude(configs.speed);
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
        this.sprite.angle = Phaser.Math.radToDeg(Phaser.Math.angleBetween(0, 0, configs.direction.x, configs.direction.y)) + 90;
    }

}

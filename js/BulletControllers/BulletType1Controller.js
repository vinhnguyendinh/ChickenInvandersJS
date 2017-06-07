class BulletType1Controller extends BulletController {
    constructor(x, y, configs) {
        Object.assign(configs, {
            speed: 1500
        });
        var spriteName = "BulletType1.png";
        super(x, y, spriteName, configs);
        this.sprite.angle = Phaser.Math.radToDeg(Phaser.Math.angleBetween(0, 0, configs.direction.x, configs.direction.y)) + 90;
    }
}

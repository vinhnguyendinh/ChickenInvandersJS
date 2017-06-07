class BulletType3Controller extends BulletController {
    constructor(x, y, configs) {
        Object.assign(configs, {
            speed: 1500
        });
        var spriteName = "BulletType3.png";
        super(x, y, spriteName, configs);
        this.sprite.anchor = new Phaser.Point(configs.positionX, 1);
    }
}

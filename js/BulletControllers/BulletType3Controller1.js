class BulletType3Controller extends BulletController {
    constructor(x, y,spriteName, configs) {
        Object.assign(configs, {
            speed: 300
        });
        super(x, y, spriteName, configs);
        this.sprite.anchor = new Phaser.Point(configs.positionX, 1);
    }
}

class BulletType2Controller extends BulletController {
    constructor(x, y, configs) {
        Object.assign(configs, {
            speed: 1500
        });
        var spriteName = "BulletType2.png";
        super(x, y, spriteName, configs);
    }

    update() {
        // TODO

    }
}

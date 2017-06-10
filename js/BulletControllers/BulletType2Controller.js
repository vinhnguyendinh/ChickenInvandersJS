class BulletType3Controller extends BulletController{
  constructor(x, y, configs){
    configs.BULLET_SPEED = 1000;
    super(x, y, 'e1.png', configs);
    this.sprite.anchor = new Phaser.Point(0.5 , 1);
  }
}

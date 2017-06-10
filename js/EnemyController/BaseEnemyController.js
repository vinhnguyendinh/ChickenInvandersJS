class BaseEnemyController {
  constructor(x, y, spriteName, configs) {
    this.position = {
      x: x,
      y: y
    }
    this.sprite = Nakama.enemyGroup.create(x, y, spriteName);
    this.configs = configs;
    // this.timeSinceLastFire = 0;

  }

  update() {
    // if (this.sprite.alive) {
    //   this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
    //   if (this.timeSinceLastFire > this.configs.cooldown) {
    //     this.fire();
    //     this.timeSinceLastFire = 0;
    //   }
    // }
  }

  fire() {}

}

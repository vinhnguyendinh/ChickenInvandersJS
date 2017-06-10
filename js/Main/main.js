var Nakama = {};
Nakama.configs = {
  PLAYER_SPEED      : 500,
  BACKGROUND_SPEED  : 5,
  BULLET_SPEED      : 1500,
  PLAYER_1_CONTROL  : {
    up        : Phaser.Keyboard.UP,
    down      : Phaser.Keyboard.DOWN,
    left      : Phaser.Keyboard.LEFT,
    right     : Phaser.Keyboard.RIGHT,
    fire      : Phaser.Keyboard.ENTER,
    spriteSuffix: "Player",
    speed     : 500,
    cooldown  : 0.3
  },
  PLAYER_2_CONTROL  : {
    up        : Phaser.Keyboard.W,
    down      : Phaser.Keyboard.S,
    left      : Phaser.Keyboard.A,
    right     : Phaser.Keyboard.D,
    fire      : Phaser.Keyboard.SPACEBAR,
    spriteSuffix: "Partner",
    speed     : 500,
    cooldown  : 0.5
  }
};

window.onload = function(){
  Nakama.game = new Phaser.Game(640,960,Phaser.AUTO,'',
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    }, false, false
  );
}

// preparations before game starts
var preload = function(){
  Nakama.game.scale.minWidth = 320;
  Nakama.game.scale.minHeight = 480;
  Nakama.game.scale.maxWidth = 640;
  Nakama.game.scale.maxHeight = 960;
  Nakama.game.scale.pageAlignHorizontally = true;
  Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  Nakama.game.time.advancedTiming = true;

  // Load images
  Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
  Nakama.game.load.image('background', 'Assets/Map1.png');
  Nakama.game.load.atlasJSONHash('chicken', 'Assets/chickens.png', 'Assets/chickens.json');

}

var chicken;

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  Nakama.background = Nakama.game.add.tileSprite(0, 0, 640, 960, 'background');
  Nakama.chickenGroup = Nakama.game.add.physicsGroup();
  Nakama.bulletGroup = Nakama.game.add.physicsGroup();
  Nakama.playerGroup = Nakama.game.add.physicsGroup();

  Nakama.chickens = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 5; j++) {
      var x = j * 80;
      var y = i * 80;
      Nakama.chickens.push(createChicken(x, y + 200));
    }
  }
  this.chickenIsMovingLeft = true;

  Nakama.players = [];
  Nakama.players.push(
    new ShipController(200, 600, '5.png', Nakama.configs.PLAYER_1_CONTROL)
  );
}

// update game state each frame
var update = function(){
    Nakama.background.tilePosition.y += 2;
    updateGroupChicken();
    for (player of Nakama.players) {
        player.update();
    }

    Nakama.game.physics.arcade.overlap(
      Nakama.bulletGroup,
      Nakama.chickenGroup,
      onBulletHitEnemy
  );
}

// before camera render (mostly for debug)
var render = function(){}

// MARK : - Chicken

// Kill chicken
var onBulletHitEnemy = function(bullet, enemy) {
    bullet.kill();
    enemy.damage(1);
}

var createChicken = function(x, y) {
  return new BaseChickenController(x, y, 'chicken', {
    speed: 14,

  });
}

function updateGroupChicken() {
  if (this.chickenIsMovingLeft && !touchingLeft()) {
      Nakama.chickenGroup.position.x -= 2;
      this.chickenIsMovingLeft = true;
  } else if (!touchingRight()) {
      Nakama.chickenGroup.position.x += 2;
      this.chickenIsMovingLeft = false;
  } else {
      this.chickenIsMovingLeft = !this.chickenIsMovingLeft;
  }
}

function touchingLeft() {
  if (Nakama.chickenGroup.position.x <= 0) {
    return true;
  }
  return false;
}

function touchingRight() {
  if (Nakama.chickenGroup.position.x + (400) >= Nakama.game.width) {
    return true;
  }
  return false;
}

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
    fire      : Phaser.Keyboard.SPACEBAR,
    spriteSuffix: "Player",
    speed     : 5,
    cooldown  : 0.3
  },
  PLAYER_2_CONTROL  : {
    up        : Phaser.Keyboard.W,
    down      : Phaser.Keyboard.S,
    left      : Phaser.Keyboard.A,
    right     : Phaser.Keyboard.D,
    fire      : Phaser.Keyboard.ENTER,
    spriteSuffix: "Partner",
    speed     : 5,
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
  Nakama.game.load.atlasJSONHash('rocketPlayer', 'Assets/rockets.png', 'Assets/rockets.json');

}

var chicken;

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  Nakama.background = Nakama.game.add.tileSprite(0, 0, 640, 960, 'background');
  Nakama.enemybulletGroup = Nakama.game.add.physicsGroup();
  Nakama.enemyGroup = Nakama.game.add.physicsGroup();
  Nakama.bulletGroup = Nakama.game.add.physicsGroup();
  Nakama.playerGroup = Nakama.game.add.physicsGroup();

  Nakama.enemies = [];
  createEnemyForLevelOne();
  this.chickenIsMovingLeft = true;

  Nakama.players = [];
  Nakama.players.push(
    new ShipController(200, 600, '5.png', Nakama.configs.PLAYER_1_CONTROL)
  );

  // Init property
  Nakama.level = 1;
  Nakama.lives = 1;
  Nakama.score = 0;
  Nakama.isPlaying = false;
  Nakama.isNextLevel = false;
  Nakama.firstStart = true;

  Nakama.introText = Nakama.game.add.text(Nakama.game.world.centerX, 400, '- ENTER to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
  Nakama.introText.anchor.setTo(0.5, 0.5);
  Nakama.introText.inputEnabled = true;
  var key1 = Nakama.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  key1.onDown.add(down, this);

  Nakama.levelText = Nakama.game.add.text(Nakama.game.world.centerX, 20, `Level: ${Nakama.level}`, { font: "20px Arial", fill: "#ffffff", align: "center" });
  Nakama.scoreText = Nakama.game.add.text(32, 900, `score: ${Nakama.score}`, { font: "20px Arial", fill: "#ffffff", align: "left" });
  Nakama.livesText = Nakama.game.add.text(550, 900, `lives: ${Nakama.lives}`, { font: "20px Arial", fill: "#ffffff", align: "left" });
}

var createEnemyForLevelOne = function() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 5; j++) {
      var x = j * 80;
      var y = i * 80;
      Nakama.enemies.push(createChicken(x, y + 200));
    }
  }
}

var createEnemyForLevelThree = function() {
  Nakama.enemies = [];
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 5; j++) {
      var x = j * 80;
      var y = i * 80;
      Nakama.enemies.push(
        new ChickenType1Controller(x, y+ 200, 'chicken', {
          speed: 14
        })
      );
    }
  }
}

function createEnemyForLevelTwo(number) {
  for (var i = number; i > 0; i--) {
    setTimeout(callback, (number - i) * 500, i);
  }
}

function callback(time) {
  var x = Nakama.game.rnd.integerInRange(-10, 640);
  var y = Nakama.game.rnd.integerInRange(-10, 10);

  Nakama.enemies.push(new StoneController(x, y, 'da.png', {
    speed: 300
  }));

  if (time <= 1) {
    Nakama.level++;
    setTimeout(callbackInitChicken, 5000);
  }

}

var callbackInitChicken = function() {
  createEnemyForLevelThree();
}

// update game state each frame
var update = function() {

  if (Nakama.isPlaying) { // Show enemy and player
    showPlayerEnemyAndText(Nakama.isPlaying);
    collision();
    Nakama.scoreText.text = `score: ${Nakama.score}`;
    Nakama.background.tilePosition.y += 2;

    for (player of Nakama.players) {
        player.update();
    }

    updateTextLevel();

    switch (Nakama.level) {
      case 1:
        updateGroupChicken();
        break;
      case 2:
        break;
      case 3:
        var checkNumber = Nakama.game.rnd.integerInRange(0, Nakama.enemies.length - 1);
        Nakama.enemies[checkNumber].update();

        updateGroupChicken();
        break;
      default:
        break;
    }

  } else { // Hide enemy and player
    if (Nakama.firstStart) {
      changeIntroText('- ENTER to start -');
    } else {
      if (Nakama.enemyGroup.countLiving() == 0) {
        changeIntroText('- ENTER to Next Level -');
      } else {
        changeIntroText('Game Over! ENTER to REPLAY');
      }
    }
    showPlayerEnemyAndText(Nakama.isPlaying);
  }

}

var updateTextLevel = function() {
  Nakama.levelText.text = `Level: ${Nakama.level}`;
}

var collision = function() {
  Nakama.game.physics.arcade.overlap(
    Nakama.bulletGroup,
    Nakama.enemyGroup,
    onBulletHitEnemy
  );

  Nakama.game.physics.arcade.overlap(
    Nakama.playerGroup,
    Nakama.enemyGroup,
    playerEnemyCollider
  );

  Nakama.game.physics.arcade.overlap(
    Nakama.playerGroup,
    Nakama.enemybulletGroup,
    playerEnemybulletCollider
  );
}

// before camera render (mostly for debug)
var render = function(){}

var playerEnemybulletCollider = function(player, enemybullet) {
  enemybullet.kill();
  player.kill();
  if (player.alive == false) {
    restart();
  }
}

var changeIntroText = function(text) {
  Nakama.introText.text = text;
}

var restart = function() {
  window.location.reload();
}

function down(item) {
  if (Nakama.firstStart) {
    Nakama.firstStart = false;
    Nakama.isPlaying = !Nakama.isPlaying;
  } else {
    if (Nakama.enemyGroup.countLiving() == 0) {
      Nakama.level++;
      Nakama.enemies = [];
      switch (Nakama.level) {
        case 1:
          createEnemyForLevelOne();
          break;
        case 2:
          createEnemyForLevelTwo(10);
          break;
        case 3:
          createEnemyForLevelThree();
          break;
        default:

      }
      Nakama.isPlaying = !Nakama.isPlaying;
    } else {
      restart();
    }
  }
}

var showPlayerEnemyAndText = function(isShow) {
  Nakama.playerGroup.visible = isShow;
  Nakama.enemyGroup.visible = isShow;
  Nakama.introText.visible = !isShow;
}

var playerEnemyCollider = function(player, enemy) {
  Nakama.lives--;
  if (Nakama.lives > 0) {

  } else {
    Nakama.isPlaying = false;
  }
}

// MARK : - Chicken

// Kill chicken
var onBulletHitEnemy = function(bullet, enemy) {
  bullet.kill();
  enemy.damage(1);
  if (enemy.alive == false) {
    Nakama.score++;
  }

  if (Nakama.enemyGroup.countLiving() == 0) {
    Nakama.isPlaying = false;
  } else {
    Nakama.isPlaying = true;
  }
}

var createChicken = function(x, y) {
  return new BaseChickenController(x, y, 'chicken', {
    speed: 14,
  });
}

function updateGroupChicken() {
  if (this.chickenIsMovingLeft && !touchingLeft()) {
      Nakama.enemyGroup.position.x -= 2;
      Nakama.enemybulletGroup.position.x -= 2;
      this.chickenIsMovingLeft = true;
  } else if (!touchingRight()) {
      Nakama.enemyGroup.position.x += 2;
      Nakama.enemybulletGroup.position.x += 2;
      this.chickenIsMovingLeft = false;
  } else {
      this.chickenIsMovingLeft = !this.chickenIsMovingLeft;
  }
}

function touchingLeft() {
  if (Nakama.enemyGroup.position.x <= 0) {
    return true;
  }
  return false;
}

function touchingRight() {
  if (Nakama.enemyGroup.position.x + (400) >= Nakama.game.width) {
    return true;
  }
  return false;
}

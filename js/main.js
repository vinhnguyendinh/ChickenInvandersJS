var Nakama = {};
Nakama.configs = {
  PLAYER_SPEED : 300,
  MAX_LEVEL    : 3,
  PLAYER_HEALTH: 3
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
  Nakama.game.load.spritesheet('kaboom', 'Assets/explode.png', 128, 128);

  // Load audio
  Nakama.game.load.audio('audio_background', 'assets/Sound/backgroundMusic.mp3');
  Nakama.game.load.audio('audio_shoot', 'assets/Sound/sound 191 (rock_wav).mp3');
  Nakama.game.load.audio('audio_enemy_die', 'assets/Sound/sound 189 (chickenhit2_wav).mp3');

}

var background;
var player;
var aliens;
var bullets;
var enemyBullets;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var audioEnemyDie;
// initialize the game
var create = function(){

  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.keyboard = Nakama.game.input.keyboard;

  //  Being mp3 files these take time to decode, so we can't play them instantly
  //  Using setDecodedCallback we can be notified when they're ALL ready for use.
  //  The audio files could decode in ANY order, we can never be sure which it'll be.
  var backgroundMusic = Nakama.game.add.audio('audio_background');
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
  backgroundMusic.loopFull();

  audioEnemyDie = Nakama.game.add.audio('audio_enemy_die');

  //  The scrolling background
  background =  Nakama.game.add.tileSprite(0, 0, 640, 960, 'background');

  //  Our bullet group
  bullets = new BulletController('d.png', 30);

  // The enemy's bullets
  enemyBullets = new BulletController('egg.png', 30);

  // The hero!
  player = new PlayerController(300, 900, '5.png', 'rocketPlayer', bullets. bullets, {
    rocketSpeed : 5,
    playerSpeed : Nakama.configs.PLAYER_SPEED,
    //  And some controls to play the game with
    fireButton  : Nakama.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    cursors     : Nakama.game.input.keyboard.createCursorKeys(),
    // Audio
    audioShoot  : 'audio_shoot'
  });

  //  The baddies!
  aliens = Nakama.game.add.group();
  aliens.enableBody = true;
  aliens.physicsBodyType = Phaser.Physics.ARCADE;

  createAliens();

  //  The score
  scoreString = 'Score : ';
  scoreText = Nakama.game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

  //  Lives
  lives = Nakama.game.add.group();
  Nakama.game.add.text(Nakama.game.world.width - 300, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

  //  Text
  stateText = Nakama.game.add.text(Nakama.game.world.centerX,Nakama.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
  stateText.anchor.setTo(0.5, 0.5);
  stateText.visible = false;

  for (var i = 0; i < Nakama.configs.PLAYER_HEALTH; i++)
  {
      var ship = lives.create(Nakama.game.world.width - 160 + (60 * i), 75, 'assets', '5.png');
      ship.anchor.setTo(0.5, 1);
      // ship.angle = 90;
      ship.alpha = 0.6;
  }

  //  An explosion pool
  explosions = Nakama.game.add.group();
  explosions.createMultiple(30, 'kaboom');
  explosions.forEach(setupInvader, this);

}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 7; x++)
        {
            var alien = new AlienController(x * 80, y * 70, aliens, 'chicken');
        }
    }

    aliens.x = 100;
    aliens.y = 150;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = Nakama.game.add.tween(aliens).to( { x: 50 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function descend() {

    aliens.y += 10;

}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

// update game state each frame
var update = function(){

  //  Scroll the background
  background.tilePosition.y += 2;

  if (player.sprite.alive) {
    // Update player
    player.update();

    // Update enemies
    if (Nakama.game.time.now > firingTimer)
    {
        enemyFires();
    }

    //  Run collision
    Nakama.game.physics.arcade.overlap(bullets.bullets, aliens, collisionHandler, null, this);
    Nakama.game.physics.arcade.overlap(enemyBullets.bullets, player.sprite, enemyHitsPlayer, null, this);
    Nakama.game.physics.arcade.overlap(aliens, player.sprite, alienHitsPlayer, null, this);
  }
  else
  {
    // If player's dead is rocket will die
    player.spriteRocket.kill();
  }

}

// before camera render (mostly for debug)
var render = function(){}

function collisionHandler (bullet, alien) {

  //  When a bullet hits an alien we kill them both
  bullet.kill();
  alien.kill();

  //  Increase the score
  score += 20;
  scoreText.text = scoreString + score;

  //  And create an explosion
  var explosion = explosions.getFirstExists(false);
  explosion.reset(alien.body.center.x, alien.body.center.y);
  explosion.play('kaboom', 30, false, true);

  // Play audio enemy die
  audioEnemyDie.play();

  if (aliens.countLiving() == 0)
  {
    score += 1000;
    scoreText.text = scoreString + score;

    enemyBullets.bullets.callAll('kill',this);
    stateText.text = " You Won, \n Click to restart";
    stateText.visible = true;

    //the "click to restart" handler
    Nakama.game.input.onTap.addOnce(restart,this);
  }

}

function enemyHitsPlayer (player,bullet) {

  bullet.kill();

  live = lives.getFirstAlive();

  if (live)
  {
    live.kill();
  }

  //  And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.center.x, player.body.center.y);
  explosion.play('kaboom', 30, false, true);

  // When the player dies
  if (lives.countLiving() < 1)
  {
    player.kill();
    enemyBullets.bullets.callAll('kill');

    stateText.text = " GAME OVER \n Click to restart";
    stateText.visible = true;

    // the "click to restart" handler
    Nakama.game.input.onTap.addOnce(restart,this);
  }

}

function alienHitsPlayer(player, alien) {

  alien.kill();

  live = lives.getFirstAlive();

  if (live)
  {
    live.kill();
  }

  //  And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(player.body.center.x, player.body.center.y);
  explosion.play('kaboom', 30, false, true);

  // When the player dies
  if (lives.countLiving() < 1)
  {
    player.kill();
    enemyBullets.bullets.callAll('kill');

    stateText.text = " GAME OVER \n Click to restart";
    stateText.visible = true;

    // the "click to restart" handler
    Nakama.game.input.onTap.addOnce(restart,this);
  }
}

function enemyFires () {

  //  Grab the first bullet we can from the pool
  enemyBullet = enemyBullets.bullets.getFirstExists(false);

  livingEnemies.length = 0;

  aliens.forEachAlive(function(alien){

    // put every living enemy in an array
    livingEnemies.push(alien);
  });


  if (enemyBullet && livingEnemies.length > 0)
  {

    var random = Nakama.game.rnd.integerInRange(0,livingEnemies.length-1);

    // randomly select one of them
    var shooter = livingEnemies[random];
    // And fire the bullet from this enemy
    enemyBullet.reset(shooter.body.x, shooter.body.y);

    Nakama.game.physics.arcade.moveToObject(enemyBullet, player.sprite, 120);
    firingTimer = Nakama.game.time.now + 2000;
  }

}

// Restart
function resetBullet (bullet) {

  //  Called if the bullet goes out of the screen
  bullet.kill();

}

function restart () {

  //  A new level starts

  //revives the player
  player.reset();
  
  //resets the life count
  lives.callAll('revive');
  //  And brings the aliens back from the dead :)
  aliens.removeAll();
  createAliens();

  //hides the text
  stateText.visible = false;

}

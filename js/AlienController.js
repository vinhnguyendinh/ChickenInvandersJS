class AlienController {
  constructor(x, y, aliens, spriteName) {

    // Alien
    this.alien = aliens.create(x, y, spriteName);
    this.alien.anchor.setTo(0.5, 0.5);
    this.alien.animations.add('run');
    this.alien.play('run', 20, true);
    this.alien.body.moves = false;

  }
}

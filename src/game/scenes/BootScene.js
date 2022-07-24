import { Scene } from 'phaser'
import paddle from '../assets/paddle.png'
import ball from '../assets/ball.png'
import brick from '../assets/glasspaddle2.png'


export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })

    this.worldWidth = 800
    this.worldHeight = 600

    this.score = 0
    this.scoreText = ''
  }

  preload () {
    this.load.image('paddle', paddle)
    this.load.image('ball', ball)
    this.load.image('brick', brick)
  }

  create () {
    this.createScore()
    this.createPaddle();
    this.createBall();
    this.createBricks();

  }

  update() {
    this.createMovement()
    this.isGameOver()
    this.physics.collide(this.player, this.ball)
    this.physics.collide(this.ball, this.bricksLineOne)
    this.physics.collide(this.ball, this.bricksLineTwo)
    this.physics.collide(this.ball, this.bricksLineThree)

  }

  createPaddle() {
    this.player = this.physics.add.sprite(400, 550, 'paddle')
    this.player.setScale(0.5)
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: [{key: 'paddle'}],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: [{key: 'paddle'}],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'afk',
      frames: [{key: 'paddle'}],
      frameRate: 20,
    });

  }

  createMovement() {
    this.cursors = this.input.keyboard.createCursorKeys()

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-240);

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(240);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('afk');
    }

  }

  createBricks() {
    this.bricksLineOne = this.physics.add.group({
      key: 'brick',
      repeat: '7',
      setXY: {
        x: 50, y:50, stepX: 100
      },
      setScale: {x: 0.25},
      immovable: true
    })

    this.bricksLineTwo = this.physics.add.group({
      key: 'brick',
      repeat: '7',
      setXY: {
        x: 50, y:100, stepX: 100
      },
      setScale: {x: 0.25},
      immovable: true
    })

    this.bricksLineThree = this.physics.add.group({
      key: 'brick',
      repeat: '7',
      setXY: {
        x: 50, y:150, stepX: 100
      },
      setScale: {x: 0.25},
      immovable: true
    })
    this.physics.add.overlap(this.ball, this.bricksLineOne, this.hideBricksOnTouch,null, this)
    this.physics.add.overlap(this.ball, this.bricksLineTwo, this.hideBricksOnTouch,null, this)
    this.physics.add.overlap(this.ball, this.bricksLineThree, this.hideBricksOnTouch,null, this)

  }

  createBall() {
    this.physics.world.setBoundsCollision(true, true, true, false)
    this.player.body.immovable = true
    this.ball = this.physics.add.sprite(400, 500, 'ball')
    this.ball.setScale(0.3)
    this.ball.setCollideWorldBounds(true)
    this.ball.onWorldBounds = true

    this.ball.setVelocityX(300);
    this.ball.setVelocityY(200)
    this.ball.body.bounce.setTo(1, 1);

  }

  createScore() {
    this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#FFF'});
  }

  hideBricksOnTouch(ball, brick) {
    this.physics.collide(ball, brick)
    brick.disableBody(true, true)

    this.score += 1
    this.scoreText.setText('Score: ' + this.score);

    let maxScore = this.bricksLineOne.getLength() + this.bricksLineTwo.getLength() + this.bricksLineThree.getLength()

    if(this.score === maxScore) {
      this.scoreText.setText('Vous avez gagné !')

      this.physics.pause()

    }

  }

  isGameOver() {
    if(this.ball.body.y > this.physics.world.bounds.height) {
      this.score = 0
      this.scene.restart()
    }
  }



}

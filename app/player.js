import Phaser from 'phaser'

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene
    this.pointer = {
      up: false,
      left: false,
      right: false
    }


    document.querySelector('.up').addEventListener('pointerdown', () => this.pointer.up = true)
    document.querySelector('.up').addEventListener('pointerup', () => this.pointer.up = false)

    document.querySelector('.left').addEventListener('pointerdown', () => this.pointer.left = true)
    document.querySelector('.left').addEventListener('pointerup', () => this.pointer.left = false)

    document.querySelector('.right').addEventListener('pointerdown', () => this.pointer.right = true)
    document.querySelector('.right').addEventListener('pointerup', () => this.pointer.right = false)

    const anims = scene.anims
    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('player', {
        start: 0,
        end: 3
      }),
      frameRate: 3,
      repeat: -1
    })
    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('player', {
        start: 8,
        end: 12
      }),
      frameRate: 12,
      repeat: -1
    })

    this.sprite = scene.physics.add
      .sprite(x, y, 'player', 0)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 700)

    const {
      LEFT,
      RIGHT,
      UP,
      W,
      A,
      D
    } = Phaser.Input.Keyboard.KeyCodes
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    })
  }

  update() {
    const keys = this.keys
    const sprite = this.sprite
    const onGround = sprite.body.blocked.down
    const acceleration = onGround ? 400 : 100

    if (keys.left.isDown || keys.a.isDown || this.pointer.left) {
      sprite.setAccelerationX(-acceleration)
      sprite.setFlipX(true)
    } else if (keys.right.isDown || keys.d.isDown || this.pointer.right) {
      sprite.setAccelerationX(acceleration)
      sprite.setFlipX(false)
    } else {
      sprite.setAccelerationX(0)
    }

    if (onGround && (keys.up.isDown || keys.w.isDown || this.pointer.up)) {
      sprite.setVelocityY(-500)
    }

    if (onGround) {
      if (sprite.body.velocity.x !== 0) sprite.anims.play('player-run', true)
      else sprite.anims.play('player-idle', true)
    } else {
      sprite.anims.stop()
      sprite.setTexture('player', 10)
    }
  }

  destroy() {
    this.sprite.destroy()
  }
}
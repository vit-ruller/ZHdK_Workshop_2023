import Phaser from 'phaser'
import Player from './player.js'
import score from './score.js'
import timer from './timer.js'

function createScene(options) {
  return class PlatformerScene extends Phaser.Scene {
    constructor() {
      super({ key: options.name })
      this.lastTime = 1
    }

    preload() {
      console.log('Preloading')
      this.load.spritesheet('player', '../assets/character.png', {
        frameWidth: 32,
        frameHeight: 32,
        margin: 0,
        spacing: 0,
      })
      this.load.image('tiles', options.tiles)
      this.load.tilemapTiledJSON(options.tileMapName, options.tileJson)
    }

    create() {
      const map = this.make.tilemap({ key: options.tileMapName })
      const tileset = map.addTilesetImage('googletileset', 'tiles')

      this.back = map.createLayer('back', tileset)
      this.groundLayer = map.createLayer('walk', tileset)
      this.front = map.createLayer('front', tileset)
      this.overlap = map.createLayer('overlap', tileset)
      this.front.setDepth(10)
      this.front.setScrollFactor(1.1)
      this.back.setScrollFactor(0.7)

      const spawnPoint = map.findObject(
        'Objects',
        (obj) => obj.name === 'spawn point'
      )
      this.player = new Player(this, spawnPoint.x, spawnPoint.y)

      this.groundLayer.setCollisionByProperty({ collides: true })
      this.overlap.setCollisionByProperty({ collides: true })
      this.physics.world.addCollider(this.groundLayer, this.player.sprite)

      this.physics.add.overlap(
        this.player.sprite,
        this.overlap,
        collectCoin,
        process,
        this
      )

      function collectCoin(player, tile) {
        tile.tilemapLayer.removeTileAt(tile.x, tile.y)
        tile.destroy(tile.x, tile.y) // remove the tile/coin
        score.up(10)
        return false
      }

      function process(player, tile) {
        return tile.properties.collides
      }

      this.cameras.main.startFollow(this.player.sprite)
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      this.cameras.main.fadeIn(1000)


      // Hide loading screen

      const loading = document.querySelector('.loading-game')
      loading.classList.add('js-hide-loading')
      setTimeout(()=>loading.classList.add('js-remove-loading'),1000)
    }


    update(time, delta) {

      let roundedTime = Math.round(time / 1000) 
      if (roundedTime > this.lastTime) {
        this.lastTime = roundedTime
        timer.up(1)
      }
    
      this.player.update()

      if (timer.value < 1)  {

        let results = document.querySelector('.results')
        let resultsScore = document.querySelector('.results-score')
        resultsScore.innerHTML = score.value
        this.player.destroy()
        this.scene.pause()
        results.classList.toggle('js-hidden')
        roundedTime = 0

        const _reset = () => {
          score.reset()
          timer.reset()
          const scenes = this.scene.scene.game.scene.scenes
          scenes.forEach(scene => scene.scene.stop())
          scenes[0].scene.restart()
          results.removeEventListener('click', _reset)
          results.classList.toggle('js-hidden')
        }
        results.addEventListener('click', _reset)
      }

      if (this.player.sprite.y > this.groundLayer.height) {
        this.player.destroy()
        this.scene.restart()
        score.reset()
        timer.reset()
        const scenes = this.scene.scene.game.scene.scenes
        scenes.forEach(scene => scene.scene.stop())
        scenes[0].scene.start()        
      }
    }
  }
}

export default createScene

import Phaser from 'phaser'
import createScene from './scene.js'

const PlatformerScene = createScene({
  name: 'Zdroje',
  tiles: '../assets/spritesheet.png',
  tileMapName: 'map',
  tileJson: '../assets/tileset.json',
  gate: 'Golden Eagle'
})

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: document.querySelector('.fullScreen'),
  fullscreenTarget: document.querySelector('.fullScreen'),
  pixelArt: true,
  backgroundColor: 'black',
  scene: [PlatformerScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 700
      },
    }
  }
}

const game = new Phaser.Game(config)

window.addEventListener('resize', function () {
  game.scale.resize(window.innerWidth, window.innerHeight)
  game.scale.refresh()
})

if (game.device.os.desktop) {
  document.querySelector('.control').classList.add('hidden')
}


document.querySelector('.full').addEventListener('click', gofull)

function gofull() {
  console.log('full')

  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen()
  } else {
    game.scale.toggleFullscreen()
  }

}

export default undefined
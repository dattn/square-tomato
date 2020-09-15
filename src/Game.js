import './Game.css'
import AssetLoader from './AssetLoader.js'
import Renderer from './Renderer.js'
import GameLoop from './GameLoop.js'
import RenderLayer from './RenderLayer.js'

const assetLoader = new AssetLoader()
assetLoader.load('characters', './assets/characters.png')
assetLoader.load('tiles', './assets/tiles.png')

const renderer = new Renderer()
renderer.mount(document.getElementById('Game'))

const layer = new RenderLayer('tomato')
renderer.addLayer(layer)

function update (delta, time) {
} 

function render (delta, time) {
    renderer.render(delta, time)
}

const loop = new GameLoop({
    fps: 30,
    update,
    render
})
loop.start()

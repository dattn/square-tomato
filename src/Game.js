import './Game.css'
import AssetLoader, { TYPE_IMAGE, TYPE_JSON } from './AssetLoader.js'
import Renderer from './Renderer.js'
import GameLoop from './GameLoop.js'
import RenderLayer from './RenderLayer.js'
import EntityContainer from './EntityContainer.js'
import Map from './Map.js'
import SpriteSheet from './SpriteSheet.js'

(async () => {
    try {
        const assetLoader = new AssetLoader()
        assetLoader.load('tiles', './assets/tiles.png', TYPE_IMAGE)
        assetLoader.load('tiles-config', './assets/tiles.json', TYPE_JSON)
        await assetLoader.ready()

        const renderer = new Renderer()
        renderer.mount(document.getElementById('Game'))

        const renderLayer = new RenderLayer('tomato')
        renderer.addLayer(renderLayer)

        const entityContainer = new EntityContainer()
        renderLayer.addElement(entityContainer)

        const tilesSpriteSheet = new SpriteSheet(
            assetLoader.get('tiles'),
            assetLoader.get('tiles-config')
        )

        const map = new Map()
        renderLayer.addElement(map)

        const gameContext = {
            delta: null,
            deltaInMs: null,
            time: null,
            renderContext: null,
            spriteSheet: {
                tiles: tilesSpriteSheet
            }
        }

        function update (delta, deltaInMs, time) {
            gameContext.delta = delta
            gameContext.deltaInMs = deltaInMs
            gameContext.time = time
            entityContainer.update(gameContext)
        }

        function render (delta, deltaInMs, time) {
            gameContext.delta = delta
            gameContext.deltaInMs = deltaInMs
            gameContext.time = time
            renderer.render(gameContext)
        }

        const loop = new GameLoop({
            fps: 30,
            update,
            render
        })
        loop.start()
    } catch (err) {
        console.error('Unhandled Error:', err.message || err)
        console.error(err)
    }
})()
import './Game.css'
import AssetLoader, { TYPE_IMAGE, TYPE_JSON } from './AssetLoader.js'
import Renderer from './Renderer.js'
import GameLoop from './GameLoop.js'
import RenderLayer from './RenderLayer.js'
import EntityContainer from './EntityContainer.js'
import Map from './Map.js'
import SpriteSheet from './SpriteSheet.js'
import KeyboardMouse from './input/KeyboardMouse.js'
import createPlayer from './createPlayer.js'
import Camera from './Camera.js'

async function startGame (elementToReplace) {
    try {
        const gameContainerElement = document.createElement('div')
        gameContainerElement.classList.add('gameContainer')
        elementToReplace.replaceWith(gameContainerElement)

        gameContainerElement.requestPointerLock()

        const assetLoader = new AssetLoader()
        assetLoader.load('tiles', './assets/tiles.png', TYPE_IMAGE)
        assetLoader.load('tiles-config', './assets/tiles.json', TYPE_JSON)
        await assetLoader.ready()

        const renderer = new Renderer()
        renderer.mount(gameContainerElement)

        const renderLayer = new RenderLayer('gray')
        renderer.addLayer(renderLayer)

        const entityContainer = new EntityContainer()
        renderLayer.addElement(entityContainer)

        const tilesSpriteSheet = new SpriteSheet(
            assetLoader.get('tiles'),
            assetLoader.get('tiles-config')
        )

        const camera = new Camera()

        const map = new Map()
        renderLayer.addElement(map)
        renderLayer.useCamera(camera)

        const sprites = [ ...tilesSpriteSheet.sprites.values() ]
        const playerSprite = sprites[Math.floor(Math.random() * sprites.length)]
        
        const keyboardMouse = new KeyboardMouse()
        const player = createPlayer(playerSprite, keyboardMouse)
        entityContainer.addEntity(player)
        renderLayer.addElement(player)


        const gameContext = {
            delta: null,
            deltaInMs: null,
            time: null,
            renderContext: null,
            spriteSheet: {
                tiles: tilesSpriteSheet
            },
            camera
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
            camera.followEntity(player, delta)
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
}

const startButtonElement = document.getElementById('StartGame')
startButtonElement.addEventListener('click', () => startGame(startButtonElement))
startButtonElement.removeAttribute('disabled')
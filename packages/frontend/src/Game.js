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
        
        const assetLoader = new AssetLoader()
        assetLoader.load('spritesheet', './assets/spritesheet.png', TYPE_IMAGE)
        assetLoader.load('spritesheet-config', './assets/spritesheet.json', TYPE_JSON)
        await assetLoader.ready()

        const renderer = new Renderer()
        renderer.mount(gameContainerElement)

        const renderLayer = new RenderLayer('black')
        renderer.addLayer(renderLayer)

        const entityContainer = new EntityContainer()
        renderLayer.addElement(entityContainer)

        const spriteSheet = new SpriteSheet(
            assetLoader.get('spritesheet'),
            assetLoader.get('spritesheet-config')
        )

        const camera = new Camera()

        const map = new Map(spriteSheet)
        renderLayer.addElement(map)
        renderLayer.useCamera(camera)

        const playerSprite = spriteSheet.getSprite('player/man-red/stand')
        const keyboardMouse = new KeyboardMouse()
        const player = createPlayer(playerSprite, keyboardMouse, map)
        player.position.set(3000, 3000)
        entityContainer.addEntity(player)
        renderLayer.addElement(player)


        const gameContext = {
            delta: null,
            deltaInMs: null,
            time: null,
            renderContext: null,
            spriteSheet,
            camera
        }

        const update = (delta, deltaInMs, time) => {
            gameContext.delta = delta
            gameContext.deltaInMs = deltaInMs
            gameContext.time = time
            entityContainer.update(gameContext)
        }

        const render = (delta, deltaInMs, time) => {
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

        const requestPointerLock = () => {
            gameContainerElement.requestPointerLock()
        }
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === gameContainerElement) {
                gameContainerElement.removeEventListener('click', requestPointerLock)
                loop.start()
            } else {
                loop.stop()
                gameContainerElement.addEventListener('click', requestPointerLock)
            }
        }
        document.addEventListener('pointerlockchange', handlePointerLockChange)
        requestPointerLock()
    } catch (err) {
        console.error('Unhandled Error:', err.message || err)
        console.error(err)
    }
}

const startButtonElement = document.getElementById('StartGame')
startButtonElement.addEventListener('click', () => startGame(startButtonElement))
startButtonElement.removeAttribute('disabled')
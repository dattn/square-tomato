import './Game.css'
import AssetLoader, { TYPE_IMAGE, TYPE_JSON } from './AssetLoader.js'
import Renderer from './Renderer.js'
import GameLoop from './GameLoop.js'
import RenderLayer from './RenderLayer.js'
import EntityContainer from './EntityContainer.js'
import GameMap from './Map.js'
import SpriteSheet from './SpriteSheet.js'
import KeyboardMouse from './input/KeyboardMouse.js'
import createPlayer from './createPlayer.js'
import Camera from './Camera.js'
import ControlTrait from './traits/Control.js'

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
        const map = new GameMap(spriteSheet)
        renderLayer.addElement(map)
        renderLayer.useCamera(camera)

        const playerSprite = spriteSheet.getSprite('player/man-red/stand')
        const keyboardMouse = new KeyboardMouse()
        const player = createPlayer(playerSprite, map)
        player.addTrait(new ControlTrait(keyboardMouse))
        player.position.set(3000, 3000)
        entityContainer.addEntity(player)
        renderLayer.addElement(player)

        const remotePlayers = new Map()
        let wsIsConnected = false
        const ws = new WebSocket('ws://localhost:3100/ws')
        ws.onopen = () => { wsIsConnected = true }
        ws.onclose = () => { wsIsConnected = false }
        ws.onmessage = async ({ data }) => {
            const buffer = await data.arrayBuffer()
            const view = new DataView(buffer)
            const id = view.getInt8(0)
            const positionX = view.getFloat32(1)
            const positionY = view.getFloat32(5)
            const directionX = view.getFloat32(9)
            const directionY = view.getFloat32(13)
        
            let player
            if (!remotePlayers.has(id)) {
                player = createPlayer(playerSprite, map)
                remotePlayers.set(id, player)
                entityContainer.addEntity(player)
                renderLayer.addElement(player)
                player.lastPosition.set(positionX, positionY)
                player.lastDirection.set(directionX, directionY)
            } else {
                player = remotePlayers.get(id)
            }

            player.position.set(positionX, positionY)
            player.direction.set(directionX, directionY)
        }

        const gameContext = {
            delta: null,
            deltaInMs: null,
            time: null,
            renderContext: null,
            spriteSheet,
            camera
        }

        const sendData = new Float32Array(4)
        const update = (delta, deltaInMs, time) => {
            gameContext.delta = delta
            gameContext.deltaInMs = deltaInMs
            gameContext.time = time
            entityContainer.update(gameContext)
            if (wsIsConnected) {
                sendData[0] = player.position.x
                sendData[1] = player.position.y
                sendData[2] = player.direction.x
                sendData[3] = player.direction.y
                ws.send(sendData)
            }
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
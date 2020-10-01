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
import RemoteTrait from './traits/Remote.js'
import Remote from './traits/Remote.js'

function getWsUrl () {
    if (import.meta.env?.VITE_WS_URL) {
        return import.meta.env?.VITE_WS_URL
    }
    const uri = `${window.location.host}/ws`
    if (window.location.protocol === 'https:') {
        return `wss://${uri}`
    }
    return `ws://${uri}`
}

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

        const removeRemotePlayer = id => {
            const player = remotePlayers.get(id)
            entityContainer.removeEntity(player)
            renderLayer.removeElement(player)
            remotePlayers.delete(id)
        }

        const removeRemotePlayers = () => {
            remotePlayers.forEach((_, id) => {
                removeRemotePlayer(id)
            })
        }

        const handleRemotePlayerPositionUpdate = view => {
            const id = view.getUint8(1)
            let player
            if (!remotePlayers.has(id)) {
                player = createPlayer(playerSprite, map)
                player.addTrait(new RemoteTrait(id))
                remotePlayers.set(id, player)
                entityContainer.addEntity(player)
                renderLayer.addElement(player)
            } else {
                player = remotePlayers.get(id)
            }

            player.getTrait(Remote).addData({
                positionX: view.getFloat32(2),
                positionY: view.getFloat32(6),
                directionX: view.getFloat32(10),
                directionY: view.getFloat32(14)
            })
        }

        const handleRemotePlayerConnectionUpdate = view => {
            const type = view.getUint8(1)
            const id = view.getUint8(2)
            switch (type) {
                case 0: // connected
                    break
                case 1: // disconnected
                    removeRemotePlayer(id)
                    break
            }
        }

        const wsMessage = async ({ data }) => {
            const buffer = await data.arrayBuffer()
            const view = new DataView(buffer)
            const type = view.getUint8(0)

            switch (type) {
                case 0:
                    handleRemotePlayerPositionUpdate(view)
                    break
                case 1:
                    handleRemotePlayerConnectionUpdate(view)
                    break
            }
        }

        let ws = null
        let wsIsConnected = false
        const wsOpen = () => { wsIsConnected = true }
        const wsClose = () => {
            ws.removeEventListener('open', wsOpen)
            ws.removeEventListener('close', wsClose)
            ws.removeEventListener('message', wsMessage)
            wsIsConnected = false

            removeRemotePlayers()

            setTimeout(() => {
                ws = null
                connectWebSocket()
            }, 2000)
        }

        const connectWebSocket = () => {
            if (!ws) {
                ws = new WebSocket(getWsUrl())
                ws.addEventListener('open', wsOpen)
                ws.addEventListener('close', wsClose)
                ws.addEventListener('message', wsMessage)
            }
        }
        connectWebSocket()

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
        loop.start()

        const requestPointerLock = () => {
            gameContainerElement.requestPointerLock()
        }
        const handlePointerLockChange = () => {
            if (document.pointerLockElement === gameContainerElement) {
                gameContainerElement.removeEventListener('click', requestPointerLock)
                keyboardMouse.enable()
            } else {
                keyboardMouse.disable()
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
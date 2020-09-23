import Vector from '../Vector.js'

const mouseKeyMap = new Map()
mouseKeyMap.set(1, 'MouseLeft')
mouseKeyMap.set(2, 'MouseMiddle')
mouseKeyMap.set(3, 'MouseRight')

export default class KeyboardMouse {
    constructor () {
        this.keys = new Set()
        this.mousePosition = new Vector()
        window.addEventListener('keydown', evt => this.handleKeyDown(evt))
        window.addEventListener('keyup', evt => this.handleKeyUp(evt))
        window.addEventListener('mousedown', evt => this.handleMouseDown(evt))
        window.addEventListener('mouseup', evt => this.handleMouseUp(evt))
        window.addEventListener('mousemove', evt => this.handleMouseMove(evt))
    }

    handleKeyDown (evt) {
        this.keys.add(evt.code)
    }

    handleKeyUp (evt) {
        this.keys.delete(evt.code)
    }

    handleMouseDown (evt) {
        this.keys.add(mouseKeyMap.get(evt.button) || `MouseKey${evt.button}`)
    }

    handleMouseUp (evt) {
        this.keys.delete(mouseKeyMap.get(evt.button) || `MouseKey${evt.button}`)
    }

    handleMouseMove (evt) {
        const { mousePosition } = this
        const { movementX, movementY } = evt
        mousePosition.x += movementX
        mousePosition.y += movementY
    }

    isKeyDown (key) {
        return this.keys.has(key)
    }
}
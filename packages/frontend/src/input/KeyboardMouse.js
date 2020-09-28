import Vector from '../Vector.js'

const mouseKeyMap = new Map()
mouseKeyMap.set(1, 'MouseLeft')
mouseKeyMap.set(2, 'MouseMiddle')
mouseKeyMap.set(3, 'MouseRight')

export default class KeyboardMouse {
    constructor () {
        this.keys = new Set()
        this.mousePosition = new Vector()

        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    enable () {
        this.keys.clear()
        this.mousePosition.set(0, 0)
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
        window.addEventListener('mousedown', this.handleMouseDown)
        window.addEventListener('mouseup', this.handleMouseUp)
        window.addEventListener('mousemove', this.handleMouseMove)
    }

    disable () {
        this.keys.clear()
        this.mousePosition.set(0, 0)
        window.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('keyup', this.handleKeyUp)
        window.removeEventListener('mousedown', this.handleMouseDown)
        window.removeEventListener('mouseup', this.handleMouseUp)
        window.removeEventListener('mousemove', this.handleMouseMove)
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
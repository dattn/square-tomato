export default class RenderLayer {
    constructor (color = null) {
        this.color = color
        this.canvas = document.createElement('canvas')
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.context = this.canvas.getContext('2d', { alpha: this.color === null })
        this.elements = new Set()
        this.renderContext = {
            canvas: this.canvas,
            context: this.context
        }
    }

    mount (targetElement) {
        const { canvas } = this
        if (targetElement) {
            targetElement.appendChild(canvas)
        } else {
            canvas.remove()
        }
    }

    addElement (element) {
        this.elements.add(element)
    }

    removeElement (element)
    {
        this.elements.delete(element)
    }

    updateSize () {
        const { canvas } = this
        const width = canvas.parentElement.clientWidth
        const height = canvas.parentElement.clientHeight
        if (width !== this.width || height !== this.height) {
            this.width = canvas.width = width
            this.height = canvas.height = height
        }
    }

    render (gameContext) {
        this.updateSize()
        const { context, canvas, color, width, height } = this

        if (color === null) {
            context.clearRect(0, 0, width, height)
        } else {
            context.fillStyle = color
            context.fillRect(0, 0, width, height)
        }
        this.elements.forEach(element => element.render(this.renderContext, gameContext))
    }
}
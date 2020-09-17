export default class RenderLayer {
    constructor (color = null) {
        this.color = color
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d', { alpha: this.color === null })
        this.elements = new Set()
        this.renderContext = {
            canvas: this.canvas,
            context: this.context
        }
    }

    mount (targetElement) {
        if (targetElement) {
            targetElement.appendChild(this.canvas)
        } else {
            this.canvas.remove()
        }
    }

    addElement (element) {
        this.elements.add(element)
    }

    removeElement (element)
    {
        this.elements.delete(element)
    }

    render (gameContext) {
        const { context, canvas: { width, height }, color } = this
        if (color === null) {
            context.clearRect(0, 0, width, height)
        } else {
            context.fillStyle = color
            context.fillRect(0, 0, width, height)
        }
        this.elements.forEach(element => element.render(this.renderContext, gameContext))
    }
}
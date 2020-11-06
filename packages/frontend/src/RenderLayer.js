import { Rect } from '@dattn/square-tomato-common'

export default class RenderLayer {
    constructor (color = null) {
        this.color = color
        this.canvas = document.createElement('canvas')
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.context = this.canvas.getContext('2d', { alpha: this.color === null })
        this.elements = new Set()
        this.visibleRect = new Rect()
        this.renderContext = {
            canvas: this.canvas,
            context: this.context,
            visibleRect: this.visibleRect
        }
        this.camera = null
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

    useCamera (camera) {
        this.camera = camera
    }

    render (gameContext) {
        this.updateSize()
        const { context, color, width, height, camera, visibleRect } = this

        if (color === null) {
            context.clearRect(0, 0, width, height)
        } else {
            context.fillStyle = color
            context.fillRect(0, 0, width, height)
        }

        context.save()
        if (camera) {
            camera.transform(this.renderContext)

            const length = Math.ceil(Math.sqrt((width * width + height * height)))
            visibleRect.x = camera.position.x - (length * 0.5)
                + (height * (camera.center.y - 0.5) * camera.direction.x)
                + (width * (camera.center.x - 0.5) * camera.direction.y)
            visibleRect.y = camera.position.y - (length * 0.5)
                + (height * (camera.center.y - 0.5) * camera.direction.y)
                - (width * (camera.center.x - 0.5) * camera.direction.x)
            visibleRect.width = length
            visibleRect.height = length
        } else {
            visibleRect.x = 0
            visibleRect.y = 0
            visibleRect.width = width
            visibleRect.height = height
        }

        this.elements.forEach(element => element.render(this.renderContext, gameContext))
        context.restore()
    }
}
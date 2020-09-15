export default class Renderer {
    constructor () {
        this.mountTo = null
        this.layers = new Set()
    }

    addLayer (layer) {
        this.layers.add(layer)
        layer.mount(this.mountTo)
    }

    removeLayer (layer) {
        this.layers.delete(layer)
    }

    mount (targetElement) {
        this.mountTo = targetElement
        this.layers.forEach(layer => layer.mount(this.mountTo))
    }

    render (loopContext) {
        this.layers.forEach(layer => layer.render(loopContext))
    }
}
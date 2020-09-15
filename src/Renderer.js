export default class Renderer {
    constructor () {
        this.mountTo = null
        this.layers = []
    }

    addLayer (layer) {
        this.layers.push(layer)
        layer.mount(this.mountTo)
    }

    mount (targetElement) {
        this.mountTo = targetElement
        for (let i = 0; i < this.layers.length; i++) {
            this.layers.mount(this.mountTo)
        }
    }

    render (delta, time) {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].render(delta, time)
        }
    }
}
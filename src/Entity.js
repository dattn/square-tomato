import Vector from './Vector.js'

let NEXT_ID = 1

export default class Trait {
    update (/* entity, gameContext */) {}
    render (/* entity, renderContext, renderContext */) {}
}

export default class Entity {
    constructor () {
        this.traits = new Map()
        this.id = NEXT_ID++
        this.position = new Vector()
        this.velocity = new Vector()
    }

    addTrait (trait) {
        this.traits.set(trait.constructor, trait)
    }

    getTrait (type) {
        return this.traits.get(type)
    }

    update (gameContext) {
        this.traits.forEach(trait => trait.update(this, gameContext))
    }

    render (renderContext, gameContext) {
        this.traits.forEach(trait => trait.render(this, renderContext, gameContext))
    }
}
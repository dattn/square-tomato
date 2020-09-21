import Vector from './Vector.js'

let NEXT_ID = 1

export class Trait {
    update (/* entity, gameContext */) {}
    render (/* entity, renderContext, gameContext */) {}
}

export default class Entity {
    constructor () {
        this.traits = new Map()
        this.id = NEXT_ID++

        this.lastPosition = new Vector()
        this.lastVelocity = new Vector()
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
        const { position, velocity, lastPosition, lastVelocity, traits } = this
        const { delta } = gameContext

        lastPosition.set(position)
        lastVelocity.set(velocity)
        velocity.set(0, 0)

        traits.forEach(trait => trait.update(this, gameContext))
        position.x += velocity.x * delta
        position.y += velocity.y * delta
    }

    render (renderContext, gameContext) {
        this.traits.forEach(trait => trait.render(this, renderContext, gameContext))
    }
}
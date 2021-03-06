import Vector from './Vector.js'

let NEXT_ID = 1

export class Trait {
    update (/* entity, gameContext */) {}
}

export default class Entity {
    constructor () {
        this.traits = new Map()
        this.id = NEXT_ID++

        this.lastPosition = new Vector()
        this.position = new Vector()

        this.lastVelocity = new Vector()
        this.velocity = new Vector()

        this.lastDirection = new Vector(0, -1)
        this.direction = new Vector(0, -1)
    }

    addTrait (trait) {
        this.traits.set(trait.constructor, trait)
    }

    getTrait (type) {
        return this.traits.get(type)
    }

    update (gameContext) {
        const { position, velocity, lastPosition, lastVelocity, traits, direction, lastDirection } = this

        lastPosition.set(position)
        lastVelocity.set(velocity)
        lastDirection.set(direction)
        velocity.set(0, 0)

        traits.forEach(trait => trait.update(this, gameContext))
        position.x += velocity.x
        position.y += velocity.y
    }

    render (/* renderContext, gameContext */) {}
}
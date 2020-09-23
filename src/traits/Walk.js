import { Trait } from '../Entity.js'
import Vector from '../Vector.js'

export default class Walk extends Trait {
    constructor () {
        super()
        this.move = new Vector()
        this.speed = 1
    }

    update (entity, gameContext) {
        const { move, speed } = this
        const { velocity, direction } = entity
        move.normalize().multiply(speed).rotate(direction.angle())
        velocity.add(move)
        move.set(0, 0)     
    }

    up () {
        this.move.add(0, -1)
    }

    down () {
        this.move.add(0, 1)
    }

    left () {
        this.move.add(-1, 0)
    }

    right () {
        this.move.add(1, 0)
    }
}
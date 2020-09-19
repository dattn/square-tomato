import { Trait } from '../Entity.js'
import Vector from '../Vector.js'

export default class Walk extends Trait {
    constructor () {
        super()
        this.direction = new Vector()
        this.speed = 1
    }

    update (entity, gameContext) {
        const { direction, speed } = this
        const { velocity } = entity
        direction.normalize().multiply(speed)
        velocity.add(direction)
        direction.set(0, 0)        
    }

    up () {
        this.direction.add(0, -1)
    }

    down () {
        this.direction.add(0, 1)
    }

    left () {
        this.direction.add(-1, 0)
    }

    right () {
        this.direction.add(1, 0)
    }
}
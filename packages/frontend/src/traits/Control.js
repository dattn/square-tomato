import { Trait } from '../Entity.js'
import Walk from './Walk.js'

export default class Control extends Trait {
    constructor (input) {
        super()
        this.input = input
    }

    update(entity) {
        const { input } = this
        const walk = entity.getTrait(Walk)
        if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) walk.up()
        if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) walk.left()
        if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) walk.down()
        if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) walk.right()

        entity.direction.rotate(input.mousePosition.x / 1000)
        input.mousePosition.set(0, 0)
    }
}
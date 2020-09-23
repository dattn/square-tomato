import Entity, { Trait } from './Entity.js'
import Walk from './traits/Walk.js'
import Vector from './Vector.js'

class Control extends Trait {
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

class RenderPlayer extends Trait {
    constructor (sprite) {
        super()
        this.sprite = sprite
        this.renderDirection = new Vector()
    }

    render (entity, renderContext, gameContext) {
        const { sprite, renderDirection } = this
        const { delta } = gameContext
        const { context } = renderContext
        const { position, lastPosition, direction, lastDirection } = entity

        const x = lastPosition.x + ((position.x - lastPosition.x) * delta)
        const y = lastPosition.y + ((position.y - lastPosition.y) * delta)
        renderDirection.set(lastDirection).lerp(direction, delta)
        
        context.save()
        context.translate(x, y)
        context.rotate(renderDirection.angle())
        context.drawImage(sprite, -32, -32)
        context.restore()
    }
}

export default function createPlayer (sprite, input) {
    const player = new Entity()
    player.addTrait(new Control(input))
    const walk = new Walk()
    walk.speed = 15
    player.addTrait(walk)
    player.addTrait(new RenderPlayer(sprite))
    return player
}
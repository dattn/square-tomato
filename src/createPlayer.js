import Entity, { Trait } from './Entity.js'
import Walk from './traits/Walk.js'

class Control extends Trait {
    constructor (input) {
        super()
        this.input = input
    }

    update(entity) {
        const { input } = this
        const walk = entity.getTrait(Walk)
        if (input.isDown('KeyW') || input.isDown('ArrowUp')) walk.up()
        if (input.isDown('KeyA') || input.isDown('ArrowLeft')) walk.left()
        if (input.isDown('KeyS') || input.isDown('ArrowDown')) walk.down()
        if (input.isDown('KeyD') || input.isDown('ArrowRight')) walk.right()
    }
}

class RenderPlayer extends Trait {
    constructor (sprite) {
        super()
        this.sprite = sprite
    }

    render (entity, renderContext, gameContext) {
        const { sprite } = this
        const { delta } = gameContext
        const { context } = renderContext
        const { position, lastPosition, velocity, lastVelocity } = entity

        const lastAngle = lastVelocity.angle()
        const angle = velocity.angle()
        const renderAngle = lastAngle + ((angle - lastAngle) * delta)

        const x = lastPosition.x + ((position.x - lastPosition.x) * delta)
        const y = lastPosition.y + ((position.y - lastPosition.y) * delta)
        
        context.save()
        context.translate(x, y)
        context.rotate(renderAngle)
        context.drawImage(sprite, -32, -32)
        context.restore()
    }
}

export default function createPlayer (sprite, input) {
    const player = new Entity()
    player.position.set(100, 100)
    player.addTrait(new Control(input))
    const walk = new Walk()
    walk.speed = 20
    player.addTrait(walk)
    player.addTrait(new RenderPlayer(sprite))
    return player
}
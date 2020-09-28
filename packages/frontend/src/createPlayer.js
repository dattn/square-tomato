import Entity, { Trait } from './Entity.js'
import MapCollider from './traits/MapCollider.js'
import Walk from './traits/Walk.js'
import Vector from './Vector.js'

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
        context.rotate(renderDirection.angle() - (Math.PI / 2))
        context.drawImage(sprite, - sprite.width * 0.5, - sprite.height * 0.5)
        context.restore()
    }
}

export default function createPlayer (sprite, map) {
    const player = new Entity()
    const walk = new Walk()
    walk.speed = 15
    player.addTrait(walk)
    player.addTrait(new MapCollider(map))
    player.addTrait(new RenderPlayer(sprite))
    return player
}
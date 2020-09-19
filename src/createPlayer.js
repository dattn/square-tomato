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
    render (entity, renderContext, gameContext) {
        const { spriteSheet } = gameContext
        const { context } = renderContext
        const { position } = entity
        const sprite = spriteSheet.tiles.getSprite('tile_534.png')

        context.drawImage(sprite, position.x - 32, position.y -32)
    }
}

export default function createPlayer (input) {
    const player = new Entity()
    player.position.set(100, 100)
    player.addTrait(new Control(input))
    const walk = new Walk()
    walk.speed = 3
    player.addTrait(walk)
    player.addTrait(new RenderPlayer())
    return player
}
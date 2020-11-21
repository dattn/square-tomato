import { createPlayerEntity, Vector } from '@dattn/square-tomato-common'

function createPlayerRenderer (entity, sprite) {
    const renderDirection = new Vector()

    return function renderPlayer (renderContext, gameContext) {
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

export default function createPlayer (map, sprite) {
    const player = createPlayerEntity(map)

    player.render = createPlayerRenderer(player, sprite)

    return player
}

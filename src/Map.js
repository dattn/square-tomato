export default class Map {
    render (renderContext, gameContext) {
        const { context, canvas } = renderContext
        const { spriteSheet } = gameContext

        const pattern = context.createPattern(
            spriteSheet.getSprite('tiles/grass/01'),
            'repeat'
        )
        context.fillStyle = pattern
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
}
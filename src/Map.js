export default class Map {
    constructor(spriteSheet) {
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        this.sprites = {
            grass: [
                spriteSheet.getSprite('tiles/grass/01'),
                spriteSheet.getSprite('tiles/grass/02'),
                spriteSheet.getSprite('tiles/grass/03'),
                spriteSheet.getSprite('tiles/grass/04')
            ],
            soil: [
                spriteSheet.getSprite('tiles/soil/01'),
                spriteSheet.getSprite('tiles/soil/02')
            ]
        }

        this.createMap()
    }

    createMap () {
        const { context, canvas, sprites } = this
        canvas.width = 64 * 100
        canvas.height = 64 * 100
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                context.drawImage(
                    sprites.grass[Math.floor(Math.random() * sprites.grass.length)],
                    0, 0, 64, 64,
                    x * 64, y * 64, 64, 64
                )
            }
        }
    }

    render (renderContext) {
        const { canvas } = this
        const { context, visibleRect } = renderContext

        context.drawImage(
            canvas,
            visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height,
            visibleRect.x, visibleRect.y, visibleRect.width, visibleRect.height
        )
    }
}
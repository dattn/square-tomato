import { Vector } from '@dattn/square-tomato-common'

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

        this.tileSize = new Vector(64, 64)
        this.countX = 100
        this.countY = 100
        this.width = this.tileSize.x * this.countX
        this.height = this.tileSize.y * this.countY

        this.createMap()
    }

    createMap () {
        const { context, canvas, sprites, width, height, countX, countY, tileSize } = this
        canvas.width = width
        canvas.height = height
        for (let x = 0; x < countX; x++) {
            for (let y = 0; y < countY; y++) {
                const sprite = sprites.grass[Math.floor(Math.random() * sprites.grass.length)]
                context.drawImage(
                    sprite,
                    0, 0, sprite.width, sprite.height,
                    x * tileSize.x, y * tileSize.y, tileSize.x, tileSize.y
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
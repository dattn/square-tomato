export default class SpriteSheet {
    constructor (image, config) {
        this.image = image
        this.config = config

        this.sprites = new Map()
        this.buildSprites()
    }

    buildSprites () {
        const { image, config, sprites } = this
        config.frames.forEach(({ frame: source, sourceSize, spriteSourceSize: target, filename, rotated }) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            const width = canvas.width = sourceSize.w
            const height = canvas.height = sourceSize.h
            if (rotated) {
                context.translate(width/2, height/2)
                context.rotate(-Math.PI / 2)
                context.drawImage(image,
                    source.x, source.y, source.h, source.w,
                    -(height/2) + target.y, -(width/2) + target.x, target.h, target.w
                )
            } else {
                context.drawImage(image,
                    source.x, source.y, source.w, source.h,
                    target.x, target.y, target.w, target.h
                )
            }
            sprites.set(filename, canvas)
        })
    }

    getSprite (name) {
        return this.sprites.get(name)
    }
}

// {
//     "filename": "tile_532.png",
//     "frame": {
//         "x": 1866,
//         "y": 773,
//         "w": 51,
//         "h": 28
//     },
//     "rotated": true,
//     "trimmed": true,
//     "spriteSourceSize": {
//         "x": 13,
//         "y": 18,
//         "w": 51,
//         "h": 28
//     },
//     "sourceSize": {
//         "w": 64,
//         "h": 64
//     }
// }
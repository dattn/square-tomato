export default class SpriteSheet {
    constructor (image, config) {
        this.image = image
        this.config = config

        this.sprites = new Map()
        this.buildSprites()
    }

    buildSprites () {
        this.config.frames.forEach(({ frame, sourceSize, spriteSourceSize, filename, rotated }) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = sourceSize.w
            canvas.height = sourceSize.h
            if (rotated) {
                context.save()
                context.translate(canvas.width/2, canvas.height/2)
                context.rotate(-Math.PI / 2)
                context.translate(-canvas.width/2, -canvas.height/2)
                context.drawImage(this.image,
                    frame.x, frame.y, frame.h, frame.w,
                    spriteSourceSize.y, spriteSourceSize.x, spriteSourceSize.h, spriteSourceSize.w
                )
                context.restore()
            } else {
                context.drawImage(this.image,
                    frame.x, frame.y, frame.w, frame.h,
                    spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h
                )
            }
            this.sprites.set(filename, canvas)
        })
    }

    getSprite (name) {
        return this.sprites.get(name)
    }
}
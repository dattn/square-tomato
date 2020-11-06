import { Vector } from '@dattn/square-tomato-common'

export default class Camera {
    constructor () {
        this.position = new Vector()
        this.center = new Vector(0.5, 0.9)
        this.direction = new Vector(0, -1)
    }

    followEntity (entity, delta) {
        this.position
            .set(entity.lastPosition)
            .lerp(entity.position, delta)
        this.direction
            .set(entity.lastDirection)
            .lerp(entity.direction, delta)
            .normalize()
    }

    transform (renderContext) {
        const { center, position, direction } = this
        const { context, canvas } = renderContext

        context.translate(
            canvas.width * center.x,
            canvas.height * center.y
        )
        context.rotate(-direction.angle())
        context.translate(
            -position.x,
            -position.y
        )
    }
}
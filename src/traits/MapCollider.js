import { Trait } from '../Entity.js'

export default class MapCollider extends Trait {
    constructor (map) {
        super()
        this.radius = 10
        this.map = map
    }

    update (entity) {
        const { position, velocity } = entity
        const { radius, map } = this

        const x = position.x + velocity.x
        if (x - radius < 0) {
            velocity.x = -position.x + radius
        } else if (x + radius > map.width) {
            velocity.x = map.width - position.x - radius
        }

        const y = position.y + velocity.y
        if (y - radius < 0) {
            velocity.y = -position.y + radius
        } else if (y + radius > map.height) {
            velocity.y = map.height - position.y - radius
        }
    }
}
import { Trait } from '../Entity.js'
import EntityCollider from './EntityCollider.js'

export default class MapCollider extends Trait {
    constructor (map) {
        super()
        this.map = map
    }

    update (entity) {
        const { position, velocity } = entity
        const { map } = this
        const { radius } = entity.getTrait(EntityCollider)

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
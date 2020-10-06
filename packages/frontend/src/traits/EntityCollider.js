import { Trait } from '../Entity.js'

export default class EntityCollider extends Trait {
    constructor (container) {
        super()
        this.radius = 10
        this.container = container
    }

    update (entity) {
        const { entities } = this.container
        const { velocity, position } = entity
        const { radius } = this

        entities.forEach(collidingEntity => {

        })
    }
}
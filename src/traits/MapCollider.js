import { Trait } from '../Entity.js'

export default class MapCollider extends Trait {
    constructor (map) {
        super()
        this.radius = 10
        this.map = map
    }

    update (entity) {
        const { position, lastPosition } = entity

        // check collision against map borders
    }
}
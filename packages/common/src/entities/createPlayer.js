import Entity from '../Entity.js'
import MapColliderTrait from '../traits/MapCollider.js'
import WalkTrait from '../traits/Walk.js'

export default function createPlayer (map) {
    const player = new Entity()
    const walk = new WalkTrait()
    walk.speed = 15
    player.addTrait(walk)
    player.addTrait(new MapColliderTrait(map))

    return player
}
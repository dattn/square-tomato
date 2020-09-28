import { Trait } from '../Entity.js'

export default class Remote extends Trait {
    constructor (id) {
        super()
        this.id = id
        this.dataStack = []
        this.dataCount = 0
    }

    addData (data) {
        this.dataStack.push(data)
        this.dataCount++
    }

    update(entity) {
        if (this.dataCount > 4) {
            let data = this.dataStack.shift()
            if (data) {
                const {
                    positionX,
                    positionY,
                    directionX,
                    directionY
                } = data
                entity.position.set(positionX, positionY)
                entity.direction.set(directionX, directionY)
            }
        }
    }
}
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
        if (this.dataStack.length > 0) {
            const {
                positionX,
                positionY,
                directionX,
                directionY
            } = this.dataStack[0]
            entity.position.set(positionX, positionY)
            entity.direction.set(directionX, directionY)
        }
        if (this.dataCount > 2) {
            this.dataStack.shift()
        }
    }
}
export class EntityLayer {
    constructor () {
        this.entities = new Set()
    }

    addEntity (entity) {
        this.entities.add(entity)
    }

    removeEntity (entity) {
        this.entities.delete(entity)
    }

    update (loopContext) {
        this.entities.forEach(entity => entity.update(loopContext))
    }

    render (loopContext) {
        this.entities.forEach(entity => entity.render(loopContext))
    }
}
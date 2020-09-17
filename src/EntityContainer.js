export default class EntityContainer {
    constructor () {
        this.entities = new Set()
    }

    addEntity (entity) {
        this.entities.add(entity)
    }

    removeEntity (entity) {
        this.entities.delete(entity)
    }

    update (gameContext) {
        this.entities.forEach(entity => entity.update(gameContext))
    }

    render (renderContext, gameContext) {
        this.entities.forEach(entity => entity.render(renderContext, gameContext))
    }
}
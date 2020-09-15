export default class Trait {
    update (delta, time) {}
    render (delta, time) {}
}

export default class Entity {
    constructor () {
        this.traits = new Map()
    }

    addTrait (trait) {
        this.traits.set(trait.constructor, trait)
    }

    getTrait (type) {
        return this.traits.get(type)
    }

    update (loopContext) {
        this.traits.forEach(trait => trait.update(loopContext))
    }

    render (loopContext) {
        this.traits.forEach(trait => trait.render(loopContext))
    }
}
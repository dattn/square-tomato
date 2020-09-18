export default class Map {
    render (renderContext, gameContext) {
        renderContext.context.drawImage(gameContext.assetLoader.get('characters'), 0, 0)
    }
}
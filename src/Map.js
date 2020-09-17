import tilesImageFile from './assets/tiles.png'
const image = new Image()
image.src = tilesImageFile

export default class Map {
    render (renderContext) {
        renderContext.context.drawImage(image, 0, 0)
    }
}
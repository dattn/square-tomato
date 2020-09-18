export const TYPE_IMAGE = Symbol('TYPE_IMAGE')

export default class AssetLoader {
    constructor () {
        this.assets = new Map()
        this.loadPromises = []
    }

    load (name, file, type) {
        this.loadPromises.push(
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(new Error(response.statusText))
                    }
                    return response.blob()
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob)
                    switch (type) {
                        case TYPE_IMAGE:
                            const img = new Image()
                            img.src = url
                            this.assets.set(name, img)
                            break

                        default:
                            throw new Error('Unknown asset type')
                    }
                })
        )
        return this.ready()
    }

    get (name) {
        const url = this.assets.get(name)
        if (!url) {
            throw new Error('Asset not found')
        }
        return  url
    }

    ready () {
        return Promise.all(this.loadPromises)
    }
}
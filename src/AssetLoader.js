export default class AssetLoader {
    constructor () {
        this.assets = new Map()
    }

    load (name, file) {
        return fetch(file)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob)
                this.assets.set(name, url)
            })
    }

    get (name) {
        const url = this.assets.get(name)
        if (!url) {
            throw new Error('Asset not found')
        }
        return  url
    }
}
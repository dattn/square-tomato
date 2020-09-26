export const TYPE_IMAGE = Symbol('TYPE_IMAGE')
export const TYPE_JSON = Symbol('TYPE_JSON')

async function handleResponse (response, type) {
    let data
    switch (type) {
        case TYPE_IMAGE:
            data = await convertToImage(response)
            break

        case TYPE_JSON:
            data = await convertToJson(response)
            break

        default:
            throw new Error('Unknown asset type')
    }
    return data
}

async function convertToImage (response) {
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const img = new Image()
    return new Promise(resolve => {
        img.onload = () => resolve(img)
        img.src = url
    })

}

async function convertToJson (response) {
    return await response.json()
}

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
                    return handleResponse(response, type)
                })
                .then(data => this.assets.set(name, data))
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
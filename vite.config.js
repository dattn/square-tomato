import ServeAssetsPlugin from './dev/ServeAssetsPlugin.js'
import GameHeaders from './dev/GameHeaders.js'

export default {
    plugins: [
        GameHeaders(),
        ServeAssetsPlugin()
    ]
}
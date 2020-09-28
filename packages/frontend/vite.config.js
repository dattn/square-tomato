import ServeAssetsPlugin from './dev/ServeAssetsPlugin.js'
import GameHeaders from './dev/GameHeaders.js'

export default {
    plugins: [
        GameHeaders(),
        ServeAssetsPlugin()
    ],
    proxy: {
        '/assets': 'http://localhost:3100/assets'
    }
}
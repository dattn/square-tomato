import GameHeaders from './dev/GameHeaders.js'

export default {
    plugins: [
        GameHeaders()
    ],
    proxy: {
        '/assets': 'http://localhost:3100'
    }
}
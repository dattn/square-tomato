import GameHeaders from './dev/GameHeaders.js'

export default {
    plugins: [
        GameHeaders()
    ],
    proxy: {
        '/ws': {
            target: 'http://localhost:3100',
            ws: true
        },
        '/assets': 'http://localhost:3100'
    }
}
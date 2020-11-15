import createServer from './createServer.js'
import initGame from './initGame.js'

(async () => {
    const { server, wss } = await createServer()
    const { loop } = initGame(wss)

    loop.start()
    server.listen(3100)
})()

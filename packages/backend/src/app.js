import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import WebSocket from 'ws'
import http from 'http'
import path from 'path'

(async () => {
    const app = new Koa()
    const server = http.createServer(app.callback())
    const wss = new WebSocket.Server({
        server,
        path: '/ws',
        perMessageDeflate: false
    })

    app.use(async (ctx, next) => {
        ctx.set('Cross-Origin-Opener-Policy', 'same-origin')
        ctx.set('Cross-Origin-Embedder-Policy', 'require-corp')
        await next()
    })

    const frontendPackageFile = await import.meta.resolve('@dattn/square-tomato-frontend/package.json')
    const frontendPath = path.resolve(path.dirname(frontendPackageFile.substr(7)), 'dist')
    app.use(mount('/', serve(frontendPath)))
    app.use(mount('/assets', serve(path.resolve('src/assets'))))

    let NEXT_CLIENT_ID = 0
    const clients = new Map()
    const idsInUse = new Set()

    function incrementNextId () {
        NEXT_CLIENT_ID = (NEXT_CLIENT_ID + 1) % 256
    }

    function getNextId() {
        if (idsInUse.size === 256) {
            return null
        }
        while (idsInUse.has(NEXT_CLIENT_ID)) {
            incrementNextId()
        }
        let id = NEXT_CLIENT_ID
        incrementNextId()
        return id
    }

    function toArrayBuffer(buffer) {
        var ab = new ArrayBuffer(buffer.length)
        var view = new Uint8Array(ab)
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i]
        }
        return ab
    }

    function sendToAllClients(ws, buffer) {
        clients.forEach((_, client) => {
            if (client !== ws) {
                client.send(buffer, { binary: true })
            }
        })
    }

    wss.on('connection', ws => {
        const id = getNextId()
        if (id === null) {
            ws.close(1005, 'Server is full')
            return
        }

        idsInUse.add(id)
        clients.set(ws, { id, lastSendPositionData: null })

        console.log(`${clients.size} players online`)

        const statusBuffer = new ArrayBuffer(2)
        const data = new Uint8Array(statusBuffer)
        data[0] = 1
        data[1] = id
        sendToAllClients(ws, statusBuffer)

        // send currently connected player positions
        clients.forEach(({ lastSendPositionData }, client) => {
            if (client !== ws && lastSendPositionData) {
                ws.send(lastSendPositionData, { binary: true })
            }
        })

        ws.on('close', () => {
            idsInUse.delete(id)
            clients.delete(ws)

            console.log(`${clients.size} players online`)

            data[0] = 2
            sendToAllClients(ws, statusBuffer)
        })

        ws.on('message', buffer => {
            const data = new Float32Array(toArrayBuffer(buffer))
            const clientData = clients.get(ws)
            const sendBuffer = new ArrayBuffer(18)
            const view = new DataView(sendBuffer)
            view.setUint8(0, 0)
            view.setUint8(1, clientData.id)
            data.forEach((value, index) => view.setFloat32(2 + (4 * index), value))
            clientData.lastSendPositionData = sendBuffer
            sendToAllClients(ws, sendBuffer)
        })
    })

    server.listen(3100)
})()

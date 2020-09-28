import Koa from 'koa'
import WebSocket from 'ws'
import http from 'http'

const app = new Koa()
const server = http.createServer(app.callback())
const wss = new WebSocket.Server({
    server,
    path: '/ws',
    perMessageDeflate: false
})

let NEXT_CLIENT_ID = 1
const clients = new Map()

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length)
    var view = new Uint8Array(ab)
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i]
    }
    return ab
}

wss.on('connection', ws => {
    clients.set(ws, {
        id: NEXT_CLIENT_ID++
    })
    ws.on('close', () => {
        clients.delete(ws)
    })

    ws.on('message', buffer => {
        const data = new Float32Array(toArrayBuffer(buffer))
        clients.forEach(({ id }, client) => {
            if (client !== ws) {
                const sendBuffer = new ArrayBuffer(17)
                const view = new DataView(sendBuffer)
                data.forEach((value, index) => view.setFloat32(1 + (4 * index), value)) 
                view.setInt8(0, id)
                client.send(sendBuffer)
            }
        })
    })
})

app.use(async ctx => {
    ctx.body = 'Hello World'
})

server.listen(3100)
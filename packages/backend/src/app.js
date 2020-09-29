import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import WebSocket from 'ws'
import http from 'http'
import path from 'path'

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

const frontendPath = path.resolve('../frontend/dist')
app.use(mount('/', serve(frontendPath)))
app.use(mount('/assets', serve(path.resolve('src/assets'))))

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
    const id = NEXT_CLIENT_ID % 255
    NEXT_CLIENT_ID++
    clients.set(ws, { id })
    ws.on('close', () => {
        clients.delete(ws)
    })

    ws.on('message', buffer => {
        const data = new Float32Array(toArrayBuffer(buffer))
        clients.forEach(({ id }, client) => {
            if (client !== ws) {
                const sendBuffer = new ArrayBuffer(17)
                const view = new DataView(sendBuffer)
                view.setUint8(0, id)
                data.forEach((value, index) => view.setFloat32(1 + (4 * index), value)) 
                client.send(view.buffer, { binary: true })
            }
        })
    })
})

server.listen(3100)
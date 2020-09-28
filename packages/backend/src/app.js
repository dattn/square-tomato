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

const clients = new Set()

wss.on('connection', ws => {
    clients.add(ws)
    ws.on('close', () => {
        clients.delete(ws)
    })

    ws.on('message', buffer => {
        clients.forEach(client => client.send(buffer))
    })
})

app.use(async ctx => {
    ctx.body = 'Hello World'
})

server.listen(3100)
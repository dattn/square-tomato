import Koa from 'koa'
import WebSocket from 'ws'
import http from 'http'

const app = new Koa()
const server = http.createServer(app.callback())
const wss = new WebSocket.Server({ server })

app.use(async ctx => {
    ctx.body = 'Hello World'
})

server.listen(3000)
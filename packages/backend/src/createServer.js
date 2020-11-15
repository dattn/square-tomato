import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import WebSocket from 'ws'
import http from 'http'
import path from 'path'

export default async function createServer () {
    const koa = new Koa()
    const server = http.createServer(koa.callback())
    const wss = new WebSocket.Server({
        server,
        path: '/ws',
        perMessageDeflate: false
    })

    koa.use(async (ctx, next) => {
        ctx.set('Cross-Origin-Opener-Policy', 'same-origin')
        ctx.set('Cross-Origin-Embedder-Policy', 'require-corp')
        await next()
    })

    const frontendPackageFile = await import.meta.resolve('@dattn/square-tomato-frontend/package.json')
    const frontendPath = path.resolve(path.dirname(frontendPackageFile.substr(7)), 'dist')
    koa.use(mount('/', serve(frontendPath)))
    koa.use(mount('/assets', serve(path.resolve('src/assets'))))

    return { server, koa, wss }
}
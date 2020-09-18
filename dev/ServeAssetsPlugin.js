import mount from 'koa-mount'
import serve from 'koa-static'
import path from 'path'

export default () => ({
    configureServer: ({ app, root }) => {
        app.use(mount('/assets', serve(path.resolve(root, 'src/assets'))))
    }
})
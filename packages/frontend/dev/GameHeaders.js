export default () => ({
    configureServer: ({ app }) => {
        app.use(async (ctx, next) => {
            ctx.set('Cross-Origin-Opener-Policy', 'same-origin')
            ctx.set('Cross-Origin-Embedder-Policy', 'require-corp')
            await next()
        })
    }
})
export default class GameLoop {
    constructor ({ fps = 30, update, render } = {}) {
        this.delta = 1000 / fps
        this.update = update || (() => {})
        this.render = render || (() => {})

        this.isRunning = false
        this.timeoutHandle = null
        this.lastFrameTime = null
        this.loopContext = {
            delta: null,
            deltaInMs: null,
            time: null
        }
    }

    start () {
        this.isRunning = true
        this.lastFrameTime = performance.now()
        this._nextFrame()
    }

    stop () {
        this._cancelNext()
        this.lastFrameTime = null
        this.isRunning = false
    }

    _nextFrame () {
        this._cancelNext()
        this.timeoutHandle = requestAnimationFrame(() => {
            const { loopContext, delta } = this
            const time = performance.now()

            // handle update
            while (this.lastFrameTime < time) {
                this.lastFrameTime += delta

                loopContext.delta = 1
                loopContext.deltaInMs = delta
                loopContext.time = this.lastFrameTime
                this.update(loopContext)
            }

            // handle render
            const renderDelta = delta - this.lastFrameTime + time
            loopContext.delta = renderDelta / delta
            loopContext.deltaInMs = renderDelta
            loopContext.time = time
            this.render(loopContext)

            // start next frame
            this._nextFrame()
        })
    }

    _cancelNext () {
        if (this.timeoutHandle) {
            cancelAnimationFrame(this.timeoutHandle)
        }
    }
}
export default class GameLoop {
    constructor ({ fps = 30, update, render } = {}) {
        this.delta = 1000 / fps
        this.update = update || (() => {})
        this.render = render || (() => {})

        this.isRunning = false
        this.timeoutHandle = null
        this.lastFrameTime = null
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
            // handle update
            var now = performance.now()

            while (this.lastFrameTime < now) {
                this.lastFrameTime += this.delta
                this.update(this.delta, this.lastFrameTime)
            }

            // handle render
            this.render(this.delta - this.lastFrameTime + now, now)

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
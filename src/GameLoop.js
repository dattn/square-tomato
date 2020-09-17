export default class GameLoop {
    constructor ({ fps = 30, update, render } = {}) {
        this.deltaInMs = 1000 / fps
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
            const { loopContext, deltaInMs } = this
            const time = performance.now()

            // handle update
            while (this.lastFrameTime < time) {
                this.lastFrameTime += deltaInMs
                this.update(
                    1, // update delta is always 1
                    deltaInMs,
                    this.lastFrameTime
                )
            }

            // handle render
            const renderDeltaInMs = deltaInMs - this.lastFrameTime + time
            this.render(
                renderDeltaInMs / deltaInMs,
                renderDeltaInMs,
                time
            )

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
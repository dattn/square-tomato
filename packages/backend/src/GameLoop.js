import { performance } from 'perf_hooks'

export default class GameLoop {
    constructor ({ fps = 30, update } = {}) {
        this.deltaInMs = Math.floor(1000 / fps)
        this.update = update || (() => {})

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
        const { deltaInMs } = this
        this._cancelNext()
        const time = performance.now()
        const nextFrameTime = (this.lastFrameTime ?? time) + deltaInMs
        const timeout = Math.max(0, nextFrameTime - time)

        this.timeoutHandle = setTimeout(() => {
            // handle update
            this.lastFrameTime += deltaInMs
            this.update(
                1, // update delta is always 1
                deltaInMs,
                this.lastFrameTime
            )

            // start next frame
            this._nextFrame()
        }, timeout)
    }

    _cancelNext () {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle)
        }
    }
}
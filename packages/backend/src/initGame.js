import GameLoop from './GameLoop.js'

export default function initGame (wss) {
    let NEXT_CLIENT_ID = 0
    const clients = new Map()
    const idsInUse = new Set()

    function incrementNextId () {
        NEXT_CLIENT_ID = (NEXT_CLIENT_ID + 1) % 256
    }

    function getNextId() {
        if (idsInUse.size === 256) {
            return null
        }
        while (idsInUse.has(NEXT_CLIENT_ID)) {
            incrementNextId()
        }
        let id = NEXT_CLIENT_ID
        incrementNextId()
        return id
    }

    function toArrayBuffer(buffer) {
        var ab = new ArrayBuffer(buffer.length)
        var view = new Uint8Array(ab)
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i]
        }
        return ab
    }

    function sendToAllClients(ws, buffer) {
        clients.forEach((_, client) => {
            if (client !== ws) {
                client.send(buffer, { binary: true })
            }
        })
    }

    wss.on('connection', ws => {
        const id = getNextId()
        if (id === null) {
            ws.close(1005, 'Server is full')
            return
        }

        idsInUse.add(id)
        clients.set(ws, { id, lastSendPositionData: null })

        console.log(`New player connected with ID:${id}. ${clients.size} players online`)

        const statusBuffer = new ArrayBuffer(2)
        const data = new Uint8Array(statusBuffer)
        data[0] = 1
        data[1] = id
        sendToAllClients(ws, statusBuffer)

        // send currently connected player positions
        clients.forEach(({ lastSendPositionData }, client) => {
            if (client !== ws && lastSendPositionData) {
                ws.send(lastSendPositionData, { binary: true })
            }
        })

        ws.on('close', () => {
            idsInUse.delete(id)
            clients.delete(ws)

            console.log(`Player with ID:${id} disconnected. ${clients.size} players online`)

            data[0] = 2
            sendToAllClients(ws, statusBuffer)
        })

        ws.on('message', buffer => {
            const data = new Float32Array(toArrayBuffer(buffer))
            const clientData = clients.get(ws)
            const sendBuffer = new ArrayBuffer(18)
            const view = new DataView(sendBuffer)
            view.setUint8(0, 0)
            view.setUint8(1, clientData.id)
            data.forEach((value, index) => view.setFloat32(2 + (4 * index), value))
            clientData.lastSendPositionData = sendBuffer
            sendToAllClients(ws, sendBuffer)
        })
    })

    const update = (delta, deltaInMs, time) => {
        console.log({ delta, deltaInMs, time })
    }

    const loop = new GameLoop({
        fps: 30,
        update
    })

    return { loop }
}
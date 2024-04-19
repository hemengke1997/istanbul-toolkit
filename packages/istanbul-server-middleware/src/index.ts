import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import os from 'node:os'
import * as nm from './istanbul-middleware'
import { Coverage } from './istanbul-middleware/lib/core'

type ServerOptions = {
  port?: number
  enableIP?: boolean
}

function getLocalIP() {
  const interfaces = os.networkInterfaces() || []
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces?.[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
}

function startServer(opts?: ServerOptions) {
  const { port = 3000, enableIP = false } = opts || {}

  const app = express()

  app.use(cors())

  app.use('/:ns/coverage', nm.createHandler({ resetOnGet: true }))

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  Coverage.init()

  if (enableIP) {
    const IP = getLocalIP()

    if (IP) {
      app.listen(port, IP, () => {
        console.log(`\nRunning at http://${IP}:${port}`)
      })
    }
  }

  app.listen(port, () => {
    console.log(`\nRunning at http://localhost:${port}`)
  })
}

export default startServer
export { startServer }
export { createHandler } from './istanbul-middleware'
export { Coverage }

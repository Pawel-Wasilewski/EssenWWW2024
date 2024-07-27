import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import { createServer } from 'http'
import { Server } from 'socket.io'

const APP_PORT       = +process.env.APP_PORT || 80
const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  throw new Error('SESSION_SECRET is not set!')
})()
const API_ENDPOINT   = process.env.API_ENDPOINT || '/api'

const app        = express()
const httpServer = createServer(app)
const socketIo   = new Server(httpServer)

app.set('trust proxy', 1)
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 86_400_000, // 24h in milliseconds
    path: API_ENDPOINT,
    sameSite: true,
    secure: true
  },
  name: 'SSID',
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET
}))

app.get(API_ENDPOINT, (req, res) => {
  res.end(`
    <script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
    </script>
  `)
  console.log('New http request!')
})

socketIo.on('connection', (socket) => {
  console.log('New user connected to websocket')
})

httpServer.listen(APP_PORT, () => {
  console.log('App is running on port ' + APP_PORT)
})

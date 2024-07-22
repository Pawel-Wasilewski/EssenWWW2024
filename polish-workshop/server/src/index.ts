import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import path from 'path'
import api from './routes/api.js'

const APP_PORT       = Number(process.env.APP_PORT) || 80
const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  throw new Error('SESSION_SECRET is not set!')
})()


const app  = express()

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 10_800_000, // 3h in milliseconds
    path: '/api/quiz',
    sameSite: true,
    secure: true
  },
  name: 'SSID',
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET
}))

app.use('/api', api)

app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

app.listen(APP_PORT, () => {
  console.log('Server listen on port ' + APP_PORT)
})

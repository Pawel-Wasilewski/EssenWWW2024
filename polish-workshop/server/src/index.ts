import 'dotenv/config'
import express, { Router } from 'express'
import session from 'express-session'
import RedisStore from 'connect-redis'
import redis from 'redis'
import path from 'path'
import flashcards from './routes/flashcards.js'
import quiz from './routes/quiz.js'
import { catchErrors, notFound } from './middlewares/errors.js'

const APP_PORT       = Number(process.env.APP_PORT) || 80
const SESSION_SECRET = process.env.SESSION_SECRET || (() => {
  throw new Error('SESSION_SECRET is not set!')
})()
const REDIS_CLIENT_PASSWORD = process.env.REDIS_CLIENT_SOCKET
const REDIS_CLIENT_SOCKET   = Number(process.env.REDIS_CLIENT_SOCKET) || 6379

const redisClient = redis.createClient({
  password: REDIS_CLIENT_PASSWORD,
  socket: {
    port: REDIS_CLIENT_SOCKET
  }
})

redisClient.connect().catch()

const api = express()

api.use(session({
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
  secret: SESSION_SECRET,
  store: new RedisStore({
    client: redisClient,
    prefix: 'quizSession'
  })
}))

api.use(express.json())

api.use('/flashcards', flashcards())
api.use('/quiz', quiz())

api.use(notFound)


const app = express()

app.set('trust proxy', 1)

app.use('/api', api)
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

app.use(catchErrors)


app.listen(APP_PORT, () => {
  console.log('Server listen on port ' + APP_PORT)
})

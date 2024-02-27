import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from 'jsonwebtoken'
import crypto, { randomBytes } from 'node:crypto'

const app = Fastify()

app.register(cors, { origin: '*', credentials: true })
app.register(cookie, { hook: 'onRequest', secret: 'my-secret' })

app.get('/', (req, reply) => {
  reply.send({ hello: 'world' })
})

app.post('/auth', async (req, reply) => {
  const { username, password } = req.body
  if (username === 'admin' && password === 'admin') {
    const [token, refreshToken] = await Promise.all([
      jwt.sign({ sessionId: '1' }, 'accesstoken', { expiresIn: '10m' }),
      jwt.sign({ sessionId: '1' }, 'refreshtoken', { expiresIn: '1h' }),
    ])

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour,
    })

    return reply.send({ token })
  }

  reply.send(401)
})

app.get('/protected', async (req, reply) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    await jwt.verify(token, 'accesstoken')
    reply.send({ data: 'Hello World Protected' })
  } catch (err) {
    reply.status(403).send({ err: err.message, message: 'token.expired' })
  }
})

app.post('/refresh-token', async (req, reply) => {
  try {
    const refreshToken = req.cookies.refreshToken
    const payload = await jwt.verify(refreshToken, 'refreshtoken')

    const [newToken, newRefreshToken] = await Promise.all([
      jwt.sign({ sessionId: '1' }, 'accesstoken', { expiresIn: '10m' }),
      jwt.sign({ sessionId: '1' }, 'refreshtoken', { expiresIn: '1h' }),
    ])

    reply.setCookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour,
    })

    reply.send({ token: newToken })
  } catch (err) {
    reply.status(403).send({ err: err.message, message: 'token.expired' })
  }
})

app.listen(3000, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

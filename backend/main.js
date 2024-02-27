import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from 'jsonwebtoken'

const ONE_HOUR = 60 * 60 * 1000
const app = Fastify({ logger: true })
app.register(cors, { origin: ['http://localhost:5173'], credentials: true })
app.register(cookie, { hook: 'onRequest', secret: 'my-secret' })

async function auth(req, reply) {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = await jwt.verify(token, 'accesstoken')
    Object.assign(req, { user: decoded })
  } catch (err) {
    reply.status(403).send({ err: 'token.expired' })
  }
}

app.get('/', { preHandler: [auth] }, (req, reply) => {
  reply.send({ hello: 'world' })
})

app.get('/protected', { preHandler: [auth] }, async (req, reply) => {
  reply.send({ data: 'Hello World Protected' })
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
      maxAge: ONE_HOUR,
    })

    return reply.send({ token })
  }

  reply.send(401)
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
      maxAge: ONE_HOUR,
    })

    reply.send({ token: newToken })
  } catch (err) {
    reply.status(403).send()
  }
})

app.listen(3000, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})

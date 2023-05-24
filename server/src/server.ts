import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'
const app = fastify()

app.register(memoriesRoutes)
app.register(cors, {
  origin: true, // aqui será inserido as urla onde o frontend podera acessar
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })

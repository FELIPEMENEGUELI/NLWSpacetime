import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prismaClient = new PrismaClient()

app.get('/users', async () => {
  const users = await prismaClient.user.findMany()
  return users
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })

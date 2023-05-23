import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/users', () => {
    const users = prisma.user.findMany()

    return users
  })
}

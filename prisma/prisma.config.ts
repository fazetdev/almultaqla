import 'dotenv/config'

export default {
  // Prisma configuration options
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  }
}

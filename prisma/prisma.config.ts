import { defineConfig } from '@prisma/client'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_DATABASE_URL,
  },
})

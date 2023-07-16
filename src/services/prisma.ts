// /* eslint-disable */
// import { PrismaClient } from '@prisma/client'

// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient
//     }
//   }
// }

// let prisma: PrismaClient

// if (typeof window === 'undefined') {
//   if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient()
//   } else {
//     if (!prisma) {
//       prisma = new PrismaClient({
//         log: ['query'],
//       })
//     }

//     prisma = prisma
//   }
// }

// export { prisma }

import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query'],
})

import { prisma } from '../../../../prisma/prisma.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresGetUserByIdRepository {
    async execute(userId) {
        return await prisma.user.findUnique({ where: { id: userId } })

        // criando inserção no banco sem o ORM Prisma
        // const user = await PostgresHelper.query(
        //     'SELECT * FROM users WHERE id = $1',
        //     [userId],
        // )

        // return user[0]
    }
}

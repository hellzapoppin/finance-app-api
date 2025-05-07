import { prisma } from '../../../../prisma/prisma.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({ where: { email } })

        // criando inserção no banco sem o ORM Prisma
        // const user = await PostgresHelper.query(
        //     'SELECT * FROM users WHERE email = $1',
        //     [email],
        // )

        // return user[0]
    }
}

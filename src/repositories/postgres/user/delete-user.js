import { prisma } from '../../../../prisma/prisma.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({ where: { id: userId } })
        } catch (error) {
            console.log(error)
            return null
        }

        // criando inserção no banco sem o ORM Prisma
        // const deleteUser = await PostgresHelper.query(
        //     `DELETE FROM users
        //     WHERE id = $1
        //     RETURNING *`,
        //     [userId],
        // )

        // return deleteUser[0]
    }
}

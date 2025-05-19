import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/user.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({ where: { id: userId } })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }
            throw error
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

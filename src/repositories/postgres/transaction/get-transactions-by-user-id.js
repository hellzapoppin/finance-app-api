// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        return await prisma.transaction.findMany({
            where: {
                user_id: userId,
            },
        })
        // criando inserção no banco sem o ORM Prisma
        // const transactions = await PostgresHelper.query(
        //     `SELECT * FROM transactions
        //     WHERE user_id = $1`,
        //     [userId],
        // )

        // return transactions
    }
}

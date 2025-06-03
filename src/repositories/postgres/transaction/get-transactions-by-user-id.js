// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId, from, to) {
        return await prisma.transaction.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
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

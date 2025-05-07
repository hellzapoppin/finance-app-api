// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: { id: transactionId },
            })
        } catch (error) {
            console.log(error)
            return null
        }

        // criando inserção no banco sem o ORM Prisma
        // const deletedTrasaction = await PostgresHelper.query(
        //     `DELETE FROM transactions
        //     WHERE id = $1
        //     RETURNING *`,
        //     [transactionId],
        // )

        // return deletedTrasaction[0]
    }
}

// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: { id: transactionId },
            })
        } catch (error) {
            console.log(error)
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }
            throw error
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

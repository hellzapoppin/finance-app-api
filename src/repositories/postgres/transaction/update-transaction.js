// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'
import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        return await prisma.transaction.update({
            where: { id: transactionId },
            data: updateTransactionParams,
        })

        // criando inserção no banco sem o ORM Prisma
        // const updateFields = []
        // const updateValues = []

        // Object.keys(updateTransactionParams).forEach((key) => {
        //     updateFields.push(`${key} = $${updateFields.length + 1}`)
        //     updateValues.push(updateTransactionParams[key])
        // })

        // updateValues.push(transactionId)

        // const updateQuery = `
        //     UPDATE transactions
        //     SET ${updateFields.join(', ')}
        //     WHERE id = $${updateValues.length}
        //     RETURNING *;
        // `

        // const updatedTransaction = await PostgresHelper.query(
        //     updateQuery,
        //     updateValues,
        // )

        // return updatedTransaction[0]
    }
}

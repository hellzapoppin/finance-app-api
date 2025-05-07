// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return await prisma.transaction.create({
            data: createTransactionParams,
        })

        // criando inserção no banco sem o ORM Prisma
        // const createdTransaction = await PostgresHelper.query(
        //     `
        //     INSERT INTO transactions (id, user_id, name, date, amount, type)
        //     VALUES ($1, $2, $3, $4, $5, $6)
        //     RETURNING *;
        //     `,
        //     [
        //         createTransactionParams.id,
        //         createTransactionParams.user_id,
        //         createTransactionParams.name,
        //         createTransactionParams.date,
        //         createTransactionParams.amount,
        //         createTransactionParams.type,
        //     ],
        // )

        // return createdTransaction[0]
    }
}

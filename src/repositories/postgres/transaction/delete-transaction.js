import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const deletedTrasaction = await PostgresHelper.query(
            `DELETE FROM transactions
            WHERE id = $1
            RETURNING *`,
            [transactionId],
        )

        return deletedTrasaction[0]
    }
}

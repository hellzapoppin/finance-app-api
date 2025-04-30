import { PostgresHelper } from '../../db/postgres/helpers.js'

export class PostgresGetUserByEmailRepository {
    async execute(email) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        )

        return user[0]
    }
}

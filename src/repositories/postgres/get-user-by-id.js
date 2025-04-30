import { PostgresHelper } from '../../db/postgres/helpers'

export class PostgressGetUserByIdRepository {
    async execute(userId) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE id = $1',
            [userId],
        )

        return user[0]
    }
}

import { prisma } from '../../../../prisma/prisma.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        return await prisma.user.create({
            data: {
                id: createUserParams.id,
                first_name: createUserParams.first_name,
                last_name: createUserParams.last_name,
                email: createUserParams.email,
                password: createUserParams.password,
            },
        })

        // criando inserção no banco sem o ORM Prisma
        // await PostgresHelper.query(
        //     'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
        //     [
        //         createUserParams.id,
        //         createUserParams.first_name,
        //         createUserParams.last_name,
        //         createUserParams.email,
        //         createUserParams.password,
        //     ],
        // )

        // const createdUser = await PostgresHelper.query(
        //     'SELECT * FROM users WHERE id = $1',
        //     [createUserParams.id],
        // )

        // return createdUser[0]
    }
}

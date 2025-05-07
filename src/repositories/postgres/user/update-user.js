import { prisma } from '../../../../prisma/prisma.js'
// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        return await prisma.user.update({
            where: { id: userId },
            data: updateUserParams,
        })

        // criando inserção no banco sem o ORM Prisma
        // const updateFields = []
        // const updateValues = []

        // Object.keys(updateUserParams).forEach((key) => {
        //     updateFields.push(`${key} = $${updateFields.length + 1}`)
        //     updateValues.push(updateUserParams[key])
        // })

        // updateValues.push(userId)

        // const updateQuery = `
        //     UPDATE users
        //     SET ${updateFields.join(', ')}
        //     WHERE id = $${updateValues.length}
        //     RETURNING *;
        // `

        // const updateUser = await PostgresHelper.query(updateQuery, updateValues)

        // return updateUser[0]
    }
}

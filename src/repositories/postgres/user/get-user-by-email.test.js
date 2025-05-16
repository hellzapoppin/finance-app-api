import { prisma } from '../../../../prisma/prisma.js'
import { user } from './../../../tests/index.js'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'

describe('Get User By Email', () => {
    it('should get user by email on DB', async () => {
        const createdUser = await prisma.user.create({ data: user })
        const sut = new PostgresGetUserByEmailRepository()

        const result = await sut.execute(createdUser.email)

        expect(result).toStrictEqual(user)
    })
})

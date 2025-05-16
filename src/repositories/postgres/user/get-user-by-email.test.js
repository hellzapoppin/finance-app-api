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

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserByEmailRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(user.email)

        expect(prismaSpy).toHaveBeenCalledWith({ where: { email: user.email } })
    })
})
